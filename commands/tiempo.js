const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiempo')
        .setDescription('Muestra el clima y la hora de una ciudad')
        .addStringOption(option => 
            option.setName('ciudad')
                .setDescription('Nombre de la ciudad (ej: Valencia, Madrid, Tokyo)')
                .setRequired(true)),

    async execute(interaction) {
        const ciudad = interaction.options.getString('ciudad');
        const apiKey = process.env.WEATHER_API_KEY;

        try {
            // Llamada a la API
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`;
            const response = await axios.get(url);
            const data = response.data;

            // Calcular la hora local de la ciudad
            const d = new Date();
            const localTime = new Date(d.getTime() + (data.timezone * 1000) + (d.getTimezoneOffset() * 60000));
            const horaFormateada = localTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            const tiempoEmbed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle(`🌤️ El tiempo en ${data.name}, ${data.sys.country}`)
                .addFields(
                    { name: '🌡️ Temp.', value: `${Math.round(data.main.temp)}°C`, inline: true },
                    { name: '🌡️ Sensación', value: `${Math.round(data.main.feels_like)}°C`, inline: true },
                    { name: '☁️ Estado', value: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1), inline: true },
                    { name: '💧 Humedad', value: `${data.main.humidity}%`, inline: true },
                    { name: '🕒 Hora Local', value: horaFormateada, inline: true }
                )
                .setThumbnail(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                .setTimestamp()
                .setFooter({ text: 'ErkoLector Weather Service' });

            await interaction.reply({ embeds: [tiempoEmbed] });

        } catch (error) {
            console.log("--- ERROR DETECTADO ---");
            
            if (error.response) {
                // El servidor respondió con un código de error (401, 404, etc.)
                if (error.response.status === 401) {
                    console.error("❌ Error 401: API Key inválida o no activa aún.");
                    return interaction.reply({ 
                        content: '🔑 **Error de API:** Tu clave de OpenWeather aún no está activa o es incorrecta. Espera 30-60 min si la acabas de crear.', 
                        flags: [MessageFlags.Ephemeral] 
                    });
                }
                if (error.response.status === 404) {
                    return interaction.reply({ 
                        content: `❌ No he podido encontrar la ciudad: **${ciudad}**.`, 
                        flags: [MessageFlags.Ephemeral] 
                    });
                }
            }
            
            console.error(error);
            await interaction.reply({ 
                content: '❌ Ocurrió un error inesperado al consultar el clima.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }
    },
};