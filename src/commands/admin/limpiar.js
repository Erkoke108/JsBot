const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, MessageFlags } = require('discord.js');

module.exports = {
    // Definición del comando para la API de Discord
    data: new SlashCommandBuilder()
        .setName('limpiar')
        .setDescription('Borra una cantidad específica de mensajes del canal.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Solo staff con este permiso
        .addIntegerOption(option => 
            option.setName('cantidad')
                .setDescription('Número de mensajes a borrar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        try {
            // Discord no permite borrar mensajes de más de 14 días de antigüedad
            const mensajesBorrados = await interaction.channel.bulkDelete(cantidad, true);

            await interaction.reply({ 
                content: `✅ Se han borrado **${mensajesBorrados.size}** mensajes correctamente.`, 
                flags: MessageFlags.Ephemeral // Solo el administrador ve este mensaje de confirmación
            });
            
        } catch (error) {
            console.error('Error al ejecutar limpiar:', error);
            await interaction.reply({ 
                content: '❌ Hubo un error al intentar borrar los mensajes. Asegúrate de que no tengan más de 14 días.', 
                flags: MessageFlags.Ephemeral 
            });
        }
    },
};