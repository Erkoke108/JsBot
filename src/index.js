const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();
client.commandArray = [];

// 1. Conexión a Base de Datos
require('./database/connection');

// 2. Cargar Handlers
const functionFiles = fs.readdirSync(`./src/functions`).filter(file => file.endsWith(".js"));
for (const file of functionFiles) {
    require(`./functions/${file}`)(client);
}

// 3. Ejecución
client.handleEvents();
client.handleCommands();

client.login(process.env.DISCORD_TOKEN);