const { MessageFlags } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Si no es un comando de barra (/), salimos
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            // Ejecutamos el comando pasando la interacción y el cliente
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
            
            const errorMessage = { content: '❌ Hubo un error al ejecutar este comando.', flags: MessageFlags.Ephemeral };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};