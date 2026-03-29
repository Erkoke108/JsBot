const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                console.log(`✅ Comando cargado: ${folder}/${command.data.name}`);
            }
        }

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            const idToUse = process.env.CLIENT_ID;
            console.log(`Iniciando registro para la aplicación: ${idToUse}`);

            await rest.put(
                Routes.applicationCommands(idToUse),
                { body: client.commandArray },
            );

            console.log("🚀 Comandos de barra (/) registrados con éxito.");
        } catch (error) {
            console.error("❌ Error de registro:");
            if (error.status === 403) {
                console.error("ERROR 403: El TOKEN no coincide con el CLIENT_ID. Ve a 'Bot' en el portal, dale a 'Reset Token' y actualiza tu .env");
            } else {
                console.error(error.message);
            }
        }
    };
};