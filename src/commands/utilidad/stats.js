const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
// Ajuste de ruta: subimos dos niveles para llegar a la raíz de src y entrar en models
const ComandoLog = require('../../models/ComandoLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Muestra las estadísticas de uso de los comandos.'),

    async execute(interaction, client) {
        try {
            // Tu lógica original de búsqueda en la base de datos
            const stats = await ComandoLog.aggregate([
                { $group: { _id: "$comando", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            if (stats.length === 0) {
                return interaction.reply({ content: 'No hay estadísticas registradas aún.', flags: MessageFlags.Ephemeral });
            }

            const embed = new EmbedBuilder()
                .setTitle('📊 Estadísticas de Uso')
                .setColor('#0099ff')
                .setTimestamp();

            stats.forEach(stat => {
                embed.addFields({ name: `/${stat._id}`, value: `Usado ${stat.count} veces`, inline: true });
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            await interaction.reply({ content: 'Hubo un error al obtener las estadísticas.', flags: MessageFlags.Ephemeral });
        }
    },
};