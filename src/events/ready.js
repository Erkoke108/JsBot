const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // Indica que solo se ejecuta una vez
    async execute(client) {
        console.log(`✅ Bot en línea como: ${client.user.tag}`);

        try {
            // Sincroniza los comandos locales con la API de Discord
            // NOTA: Si no has añadido comandos nuevos, puedes comentar la línea de abajo
            await client.application.commands.set(client.commands.map(c => c.data));
            console.log('🚀 Comandos sincronizados globalmente.');
        } catch (error) {
            console.error('❌ Error al sincronizar comandos:', error);
        }
    },
};