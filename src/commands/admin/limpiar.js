const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limpiar')
        .setDescription('Borra mensajes')
        .addIntegerOption(opt => opt.setName('cantidad').setDescription('Nº de mensajes').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Solo usuarios con este permiso lo ven
    async execute(interaction) {
        const cant = interaction.options.getInteger('cantidad');
        // Borramos los mensajes (el 'true' filtra mensajes de más de 14 días)
        const deleted = await interaction.channel.bulkDelete(cant, true);
        await interaction.reply({ content: `🧹 Se han borrado ${deleted.size} mensajes.`, flags: [MessageFlags.Ephemeral] });
    },
};