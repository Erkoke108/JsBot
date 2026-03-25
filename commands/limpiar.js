const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limpiar')
        .setDescription('Borra una cantidad específica de mensajes')
        .addIntegerOption(option => 
            option.setName('cantidad')
                .setDescription('Número de mensajes a borrar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        // Solo usuarios con permiso de Gestionar Mensajes pueden verlo/usarlo
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        try {
            const deleted = await interaction.channel.bulkDelete(cantidad, true);
            
            await interaction.reply({ 
                content: `🧹 Se han borrado **${deleted.size}** mensajes con éxito.`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Hubo un error al intentar borrar mensajes. (Recuerda que no puedo borrar mensajes de más de 14 días).', 
                ephemeral: true 
            });
        }
    },
};