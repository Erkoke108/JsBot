const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Muestra el estado técnico del bot'),
    async execute(interaction) {
        // Suma de miembros de todos los servidores donde está el bot
        const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📊 Estadísticas del Bot')
            .addFields(
                { name: '🌐 Servidores', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Miembros', value: `${totalMembers}`, inline: true },
                { name: '📡 Latencia', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: '💻 RAM', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    },
};