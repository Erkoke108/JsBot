const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givemebadge')
        .setDescription('Comando para la insignia de desarrollador'),
    async execute(interaction) {
        await interaction.reply({ 
            content: '✅ ¡Comando modular ejecutado! Los datos se han enviado a Discord.', 
            ephemeral: true 
        });
    },
};