const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const FallaPremio = require('../../models/FallaPremio');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fallas')
        .setDescription('Consulta los premios de las Fallas de Sección Especial.')
        .addIntegerOption(option =>
            option.setName('año')
                .setDescription('El año a consultar (ej. 2026)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('premio')
                .setDescription('El número de premio (1-9)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('solo_primeros')
                .setDescription('Si se deben mostrar solo los primeros premios')
                .setRequired(false)),

    async execute(interaction) {
        const año = interaction.options.getInteger('año');
        const premioNum = interaction.options.getInteger('premio');
        const soloPrimeros = interaction.options.getBoolean('solo_primeros') ?? false;

        try {
            const añoOriginal = interaction.options.getInteger('año');
            let query = {};
            if (añoOriginal) query.año = añoOriginal;
            if (premioNum) query.premio = premioNum;
            if (soloPrimeros) query.premio = 1;

            // Redirección especial para el año 2020 (Pandemia)
            let esRedireccion2020 = false;
            if (añoOriginal === 2020) {
                query.año = 2021;
                esRedireccion2020 = true;
            }

            const premios = await FallaPremio.find(query).sort({ año: -1, premio: 1 });

            if (premios.length === 0) {
                return interaction.reply({
                    content: '❌ No se encontraron premios con esos criterios.',
                    flags: [MessageFlags.Ephemeral]
                });
            }

            // Si hay un solo resultado, mostramos un embed detallado con imagen grande
            if (premios.length === 1) {
                const p = premios[0];
                const añoDisplay = esRedireccion2020 ? "2020-2021" : p.año;

                const embed = new EmbedBuilder()
                    .setTitle(`🏆 ${p.premio}º Premio Sección Especial ${añoDisplay}`)
                    .setDescription(`**Comisión:** ${p.comision}\n**Censo:** ${p.censo}\n**Artista:** ${p.artista}\n**Lema:** "${p.lema}"`)
                    .setColor('#ff9900')
                    .setTimestamp();

                if (p.imagen) embed.setImage(p.imagen);

                return await interaction.reply({ embeds: [embed] });
            }

            // Si hay múltiples resultados, agrupamos por año y mostramos los 3 más recientes con imágenes o lista
            const embeds = [];
            const premiosPorAño = premios.reduce((acc, curr) => {
                if (!acc[curr.año]) acc[curr.año] = [];
                acc[curr.año].push(curr);
                return acc;
            }, {});

            const años = Object.keys(premiosPorAño).sort((a, b) => b - a).slice(0, 3); // Limitamos a 3 años para evitar saturar imágenes

            for (const a of años) {
                const lista = premiosPorAño[a].map(p =>
                    `**${p.premio}º:** ${p.comision} (*${p.lema}*)`
                ).join('\n');

                const añoDisplay = (esRedireccion2020 && a == 2021) ? "2020-2021" : a;

                const embed = new EmbedBuilder()
                    .setTitle(`🏆 Fallas Sección Especial - Año ${añoDisplay}`)
                    .setDescription(lista)
                    .setColor('#ff9900');

                // Si el primer premio tiene imagen, la ponemos de miniatura
                const top1 = premiosPorAño[a].find(p => p.premio === 1);
                if (top1 && top1.imagen) {
                    embed.setThumbnail(top1.imagen);
                }

                embeds.push(embed);
            }

            await interaction.reply({
                content: premios.length > 10 ? `⚠️ Mostrando los resultados más recientes (Total: ${premios.length}).` : null,
                embeds: embeds
            });

        } catch (error) {
            console.error('Error al consultar premios de fallas:', error);
            await interaction.reply({
                content: '❌ Hubo un error al consultar la base de datos de fallas.',
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};

