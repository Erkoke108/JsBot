const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // Indica que este evento solo se ejecuta una vez al iniciar
    async execute(client) {
        console.log(`✅ [Sistema] Sesión iniciada como: ${client.user.tag}`);
        console.log(`🤖 [Sistema] El bot está presente en ${client.guilds.cache.size} servidores.`);

        // Establecemos un estado visual para el bot
        try {
            client.user.setPresence({
                activities: [{ 
                    name: 'el código en GitHub', 
                    type: ActivityType.Watching 
                }],
                status: 'online',
            });
            console.log('✨ [Sistema] Estado de presencia actualizado correctamente.');
        } catch (error) {
            console.error('❌ [Sistema] Error al establecer la presencia:', error);
        }
    },
};