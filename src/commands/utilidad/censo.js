const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const FallaComision = require('../../models/FallaComision');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('censo')
        .setDescription('Muestra la lista completa de comisiones falleras censadas.')
        .addIntegerOption(option =>
            option.setName('pagina')
                .setDescription('El número de página a mostrar')
                .setRequired(false)),

    async execute(interaction) {
        let page = interaction.options.getInteger('pagina') || 1;
        const limit = 20;

        try {
            const totalComisiones = await FallaComision.countDocuments({});
            const totalPages = Math.ceil(totalComisiones / limit);

            if (page > totalPages) page = totalPages;
            if (page < 1) page = 1;

            const comisiones = await FallaComision.find({})
                .sort({ censo: 1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const generateEmbed = (p) => {
                const start = (p - 1) * limit;
                const end = Math.min(start + limit, totalComisiones);

                const list = comisiones.map(c =>
                    `**Nº ${c.censo}** - ${c.nombre} ${c.fundacion > 0 ? `(*Fundada en ${c.fundacion}*)` : ''}`
                ).join('\n');

                return new EmbedBuilder()
                    .setTitle('📇 Censo Oficial Comisiones Falleras (JCF)')
                    .setDescription(list || 'No hay comisiones en esta página.')
                    .setFooter({ text: `Página ${p} de ${totalPages} | Total: ${totalComisiones} comisiones` })
                    .setColor('#ff9900');
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev_page')
                        .setLabel('Anterior')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('next_page')
                        .setLabel('Siguiente')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages)
                );

            const message = await interaction.reply({
                embeds: [generateEmbed(page)],
                components: [row],
                fetchReply: true
            });

            // Colector para manejar la paginación interactiva
            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 300000 // 5 minutos de interactividad
            });

            collector.on('collect', async i => {
                if (i.customId === 'prev_page') page--;
                else if (i.customId === 'next_page') page++;

                // Actualizar datos de la nueva página
                const nuevasComisiones = await FallaComision.find({})
                    .sort({ censo: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit);

                const updateEmbed = (p) => {
                    const list = nuevasComisiones.map(c =>
                        `**Nº ${c.censo}** - ${c.nombre} ${c.fundacion > 0 ? `(*Fundada en ${c.fundacion}*)` : ''}`
                    ).join('\n');

                    return new EmbedBuilder()
                        .setTitle('📇 Censo Oficial Comisiones Falleras (JCF)')
                        .setDescription(list)
                        .setFooter({ text: `Página ${p} de ${totalPages} | Total: ${totalComisiones} comisiones` })
                        .setColor('#ff9900');
                };

                const updateRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev_page')
                            .setLabel('Anterior')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === 1),
                        new ButtonBuilder()
                            .setCustomId('next_page')
                            .setLabel('Siguiente')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === totalPages)
                    );

                await i.update({
                    embeds: [updateEmbed(page)],
                    components: [updateRow]
                });
            });

            collector.on('end', () => {
                // Deshabilitar botones al terminar el tiempo
                const disabledRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('prev_page').setLabel('Anterior').setStyle(ButtonStyle.Secondary).setDisabled(true),
                        new ButtonBuilder().setCustomId('next_page').setLabel('Siguiente').setStyle(ButtonStyle.Primary).setDisabled(true)
                    );
                interaction.editReply({ components: [disabledRow] }).catch(() => { });
            });

        } catch (error) {
            console.error('Error en comando /censo:', error);
            await interaction.reply({
                content: '❌ Hubo un error al consultar el censo.',
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
