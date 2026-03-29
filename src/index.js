// © 2026 Erkoke108. Todos los derechos reservados.
// Este código es propiedad de Erkoke108.
// No se permite la reproducción, distribución o modificación sin autorización.

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const fs = require('fs');
const mongoose = require('mongoose'); // <--- AÑADIDO
require('dotenv').config();

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.events = new Collection();

// CONEXIÓN A MONGODB (AÑADIDO)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

// CARGA DE FUNCIONES (Respetando tu estructura de Git)
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const folderPath = `./src/functions/${folder}`;
  
  // Solo intentamos leer si es una carpeta (evita errores con archivos sueltos)
  if (fs.lstatSync(folderPath).isDirectory()) {
    const functionFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith('.js'));
    for (const file of functionFiles)
      require(`./src/functions/${folder}/${file}`)(client);
  }
}

client.handleEvents();
client.handleCommands();

client.login(process.env.token);