const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const FallaPremio = require('../../models/FallaPremio');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fallas')
        .setDescription('Consulta los premios de las Fallas de Sección Especial.')
        .addIntegerOption(option => 
            option.setName('año')
                .setDescription('El año a consultar')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('solo_primeros')
                .setDescription('Si se deben mostrar solo los primeros premios')
                .setRequired(false)),

    async execute(interaction) {
        const año = interaction.options.getInteger('año');
        const soloPrimeros = interaction.options.getBoolean('solo_primeros') ?? false;

        try {
            let query = {};
            if (año) query.año = año;
            if (soloPrimeros) query.premio = 1;

            const premios = await FallaPremio.find(query).sort({ año: -1, premio: 1 });

            if (premios.length === 0) {
                return interaction.reply({ 
                    content: '❌ No se encontraron premios con esos criterios.', 
                    flags: [MessageFlags.Ephemeral] 
                });
            }

            const embeds = [];
            // Agrupamos por año para mostrar embeds limpios
            const premiosPorAño = premios.reduce((acc, curr) => {
                if (!acc[curr.año]) acc[curr.año] = [];
                acc[curr.año].push(curr);
                return acc;
            }, {});

            const años = Object.keys(premiosPorAño).slice(0, 5); // Limitamos a los 5 años más recientes para no saturar

            for (const a of años) {
                const lista = premiosPorAño[a].map(p => 
                    `**${p.premio}º Premio:** ${p.comision} (Censo ${p.censo})\n*Artista:* ${p.artista} | *Lema:* "${p.lema}"`
                ).join('\n\n');

                const embed = new EmbedBuilder()
                    .setTitle(`🏆 Premios Sección Especial - Año ${a}`)
                    .setDescription(lista)
                    .setColor('#ff9900')
                    .setTimestamp();
                
                embeds.push(embed);
            }

            // Si hay demasiados años (más de 5), avisamos
            let replyContent = {};
            if (Object.keys(premiosPorAño).length > 5) {
                replyContent.content = `⚠️ Se muestran los 5 años más recientes de tu búsqueda.`;
            }
            replyContent.embeds = embeds;

            await interaction.reply(replyContent);

        } catch (error) {
            console.error('Error al consultar premios de fallas:', error);
            await interaction.reply({ 
                content: '❌ Hubo un error al consultar la base de datos de fallas.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }
    },
};
