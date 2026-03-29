const { InteractionType } = require('discord.js');
const ComandoLog = require('../../models/ComandoLog'); // <--- RUTA VERIFICADA

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      // --- LOG EN MONGODB (AÑADIDO) ---
      try {
        const nuevoRegistro = new ComandoLog({
          userId: interaction.user.id,
          username: interaction.user.tag,
          comando: commandName,
          fecha: new Date()
        });
        await nuevoRegistro.save();
        console.log(`💾 Log: ${interaction.user.tag} ejecutó /${commandName}`);
      } catch (error) {
        console.error('❌ Error al guardar log en MongoDB:', error);
      }
      // --------------------------------

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Algo salió mal al ejecutar este comando...`,
          ephemeral: true,
        });
      }
    } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
  },
};