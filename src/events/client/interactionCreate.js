const { MessageFlags, EmbedBuilder } = require('discord.js');
const ComandoLog = require('../../models/ComandoLog');
const settings = require('../../settings');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            // --- 📝 Registro en Base de Datos ---
            await ComandoLog.create({
                userId: interaction.user.id,
                username: interaction.user.username,
                comando: interaction.commandName
            });

            // --- 📡 Envío de Log a Canal ---
            const logChannel = client.channels.cache.get(settings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('🚀 Comando Ejecutado')
                    .setDescription(`El usuario **${interaction.user.tag}** (\`${interaction.user.id}\`) ha ejecutado un comando.`)
                    .addFields(
                        { name: '✨ Comando', value: `\`/${interaction.commandName}\``, inline: true },
                        { name: '📍 Canal', value: `<#${interaction.channelId}>`, inline: true }
                    )
                    .setColor('#00ffcc')
                    .setTimestamp();
                
                await logChannel.send({ embeds: [embed] });
            }

            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
            
            const errorMessage = { content: '❌ Hubo un error al ejecutar este comando.', flags: MessageFlags.Ephemeral };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};