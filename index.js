require('dotenv').config(); // Esto carga el archivo .env
const { Client, GatewayIntentBits } = require('discord.js');

// Creamos el cliente con los permisos necesarios
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Evento: Cuando el bot se conecta
client.once('ready', () => {
    console.log(`¡Bot encendido como ${client.user.tag}!`);
});

// Evento: Cuando alguien escribe un mensaje
client.on('messageCreate', async (message) => { // Añadimos 'async' para poder usar 'await'
    if (message.author.bot) return;

    // Comando !hola (el que ya tenías)
    if (message.content === '!hola') {
        message.reply('¡Hola! Estoy vivo y funcionando. 🤖');
    }

    // Comando !limpiar
    if (message.content.startsWith('!limpiar')) {
        // Verificamos si el usuario tiene permiso para borrar mensajes
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('No tienes permiso para borrar mensajes, granuja.');
        }

        const args = message.content.split(' '); // Dividimos el mensaje por espacios
        const cantidad = args[1]; // El segundo elemento (ej: 10 o all)

        if (!cantidad) return message.reply('Dime cuántos mensajes quieres borrar. Ej: `!limpiar 10` o `!limpiar all`');

        try {
            if (cantidad === 'all') {
                // Para borrar "todo", borramos el máximo permitido por Discord de una vez (100)
                // Nota: Discord solo permite borrar mensajes de menos de 14 días de antigüedad.
                const deleted = await message.channel.bulkDelete(100, true);
                message.channel.send(`🧹 He limpiado el canal (borrados ${deleted.size} mensajes recientes).`).then(msg => setTimeout(() => msg.delete(), 5000));
            } else {
                const num = parseInt(cantidad);
                if (isNaN(num) || num <= 0 || num > 100) {
                    return message.reply('Por favor, pon un número entre 1 y 100.');
                }

                // Borramos los mensajes (incluyendo el comando que acabas de escribir)
                const deleted = await message.channel.bulkDelete(num, true);
                message.channel.send(`🧹 Borrados ${deleted.size} mensajes.`).then(msg => setTimeout(() => msg.delete(), 5000));
            }
        } catch (error) {
            console.error(error);
            message.reply('Hubo un error al intentar borrar los mensajes. (Puede que sean más viejos de 14 días).');
        }
    }
});

// Login con tu Token (Pégalo aquí entre las comillas)
client.login(process.env.DISCORD_TOKEN);