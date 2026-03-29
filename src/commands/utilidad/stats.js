const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ComandoLog = require('../../models/ComandoLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Muestra las estadísticas de uso de comandos de un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario para ver sus estadísticas')
                .setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;

        try {
            // Obtener el total de comandos usados por el usuario
            const totalComandos = await ComandoLog.countDocuments({ userId: targetUser.id });

            // Obtener el desglose de comandos usados
            const stats = await ComandoLog.aggregate([
                { $match: { userId: targetUser.id } },
                { $group: { _id: "$comando", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const embed = new EmbedBuilder()
                .setTitle(`📊 Estadísticas de ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setColor('#00ffcc')
                .addFields(
                    { name: '📈 Total Comandos', value: `\`${totalComandos}\``, inline: false }
                )
                .setTimestamp();

            if (stats.length > 0) {
                let listado = stats.map(s => `**/${s._id}**: ${s.count} veces`).join('\n');
                embed.addFields({ name: '✨ Desglose de Comandos', value: listado });
            } else {
                embed.setDescription('Este usuario aún no ha utilizado ningún comando.');
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            await interaction.reply({ 
                content: '❌ Hubo un error al consultar las estadísticas en la base de datos.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }
    },
};