const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // MessageFlags
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comisiones')
        .setDescription('Busca información detallada sobre las comisiones falleras de Valencia.')
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('Nombre de la comisión fallera')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('seccion')
                .setDescription('Filtrar por sección (ej. Especial, 1A, 2B...)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply(); // Diferimos ya que la API puede tardar un poco

        const nombreBusqueda = interaction.options.getString('nombre')?.toLowerCase();
        const seccionBusqueda = interaction.options.getString('seccion')?.toUpperCase();

        const url = 'https://geoportal.valencia.es/server/rest/services/OPENDATA/Turismo/MapServer/215/query?where=1=1&outFields=*&f=json';

        try {
            const response = await axios.get(url);
            
            if (!response.data || !response.data.features) {
                return interaction.editReply({ content: '❌ No se pudo obtener información de la API de Geoportal Valencia.' });
            }

            let fallas = response.data.features.map(f => f.attributes);

            // Filtrar por nombre
            if (nombreBusqueda) {
                fallas = fallas.filter(f => f.nombre && f.nombre.toLowerCase().includes(nombreBusqueda));
            }

            // Filtrar por sección
            if (seccionBusqueda) {
                fallas = fallas.filter(f => f.seccion && f.seccion.toUpperCase() === seccionBusqueda);
            }

            // Eliminar duplicados o registros sin nombre (limpieza de datos)
            fallas = fallas.filter(f => f.nombre !== null);

            if (fallas.length === 0) {
                return interaction.editReply({ content: '🔍 No se encontró ninguna comisión con esos criterios.' });
            }

            // Si hay un solo resultado, embed detallado
            if (fallas.length === 1) {
                const f = fallas[0];
                const embed = new EmbedBuilder()
                    .setTitle(`🏙️ Falla ${f.nombre.trim()}`)
                    .setURL(f.boceto || null)
                    .setColor('#ff4500')
                    .addFields(
                        { name: '📍 Sección', value: f.seccion || 'N/A', inline: true },
                        { name: '📅 Fundación', value: f.anyo_fundacion?.toString() || 'N/A', inline: true },
                        { name: '🎨 Artista', value: f.artista || 'N/A', inline: false },
                        { name: '✨ Lema', value: f.lema || 'N/A', inline: false },
                        { name: '👑 Fallera Mayor', value: f.fallera || 'N/A', inline: true },
                        { name: '💼 Presidente', value: f.presidente || 'N/A', inline: true }
                    )
                    .setTimestamp();

                if (f.boceto) {
                    embed.setImage(f.boceto);
                }

                return await interaction.editReply({ embeds: [embed] });
            }

            // Si hay múltiples resultados, listado resumido
            const maxResults = 10;
            const resultsToShow = fallas.slice(0, maxResults);
            
            const embedList = new EmbedBuilder()
                .setTitle(`📂 Comisiones Encontradas (${fallas.length})`)
                .setDescription(`Se muestran los primeros ${resultsToShow.length} resultados. Refina tu búsqueda con el parámetro 'nombre' si no encuentras la que buscas.`)
                .setColor('#ff4500')
                .setTimestamp();

            resultsToShow.forEach(f => {
                embedList.addFields({ 
                    name: f.nombre.trim(), 
                    value: `Sección: **${f.seccion || 'N/A'}** | Artista: ${f.artista || 'N/A'}`,
                    inline: false 
                });
            });

            await interaction.editReply({ embeds: [embedList] });

        } catch (error) {
            console.error('Error al consultar la API de comisiones:', error);
            await interaction.editReply({ content: '❌ Error al conectar con el servicio de Open Data de Valencia.' });
        }
    },
};
