const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot modular encendido como ${client.user.tag}`);
        
        // Registro automático de comandos al encender
        try {
            await client.application.commands.set(client.commands.map(c => c.data));
            console.log('🚀 Comandos sincronizados con Discord.');
        } catch (error) {
            console.error(error);
        }
    },
};