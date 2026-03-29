const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiempo')
        .setDescription('Clima de una ciudad')
        .addStringOption(opt => opt.setName('ciudad').setDescription('Nombre de la ciudad').setRequired(true)),
    async execute(interaction) {
        const ciudad = interaction.options.getString('ciudad');
        // Limpiamos la ciudad para que caracteres raros no rompan la URL
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&units=metric&lang=es&appid=${process.env.WEATHER_API_KEY}`;

        try {
            const res = await axios.get(url);
            const embed = new EmbedBuilder()
                .setTitle(`🌤️ Tiempo en ${res.data.name}`)
                .setDescription(`Temperatura: **${Math.round(res.data.main.temp)}°C**\nEstado: ${res.data.weather[0].description}`)
                .setColor('#00ffcc');
            
            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            await interaction.reply({ content: '❌ Ciudad no encontrada.', flags: [MessageFlags.Ephemeral] });
        }
    },
};