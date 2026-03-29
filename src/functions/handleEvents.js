const fs = require('fs');

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);
        for (const folder of eventFolders) {
            const path = `./src/events/${folder}`;
            const stat = fs.lstatSync(path);

            if (stat.isDirectory()) {
                const eventFiles = fs.readdirSync(path).filter(file => file.endsWith(".js"));
                for (const file of eventFiles) {
                    const event = require(`../events/${folder}/${file}`);
                    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                    else client.on(event.name, (...args) => event.execute(...args, client));
                    console.log(`📡 Evento cargado: ${folder}/${event.name}`);
                }
            } else if (folder.endsWith(".js")) {
                const event = require(`../events/${folder}`);
                if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                else client.on(event.name, (...args) => event.execute(...args, client));
                console.log(`📡 Evento cargado: ${event.name}`);
            }
        }
    };
};