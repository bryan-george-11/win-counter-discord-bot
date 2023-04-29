const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "help",
    description: "Replies with help menu.",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, database, db) => {
    try {
      const commandName = client.prefix_commands.map(command => `${prefix}${command.config.name}`);
      const commandDescription = client.prefix_commands.map(command => `${command.config.description}`);

      const commandFields = [];
      for (const [index, name] of commandName.entries()) {
        const description = commandDescription[index];
        commandFields.push({ name: name, value: description });
      }

      const helpCommands = new EmbedBuilder()
        .setTitle('Warzone Wins Discord Bot Help')
        .setColor('bf1919')
        .setDescription('Here are the available commands for this bot:')
        .addFields(...commandFields)
        .setTimestamp()
        .setAuthor({ name: 'Bot Helper', iconURL: 'https://media.istockphoto.com/id/1128516744/vector/robot-icon-bot-sign-design-chatbot-symbol-concept-voice-support-service-bot-online-support.jpg?s=612x612&w=0&k=20&c=Z8MetVg7f2qkrg6pEBl2LOvqGcZp8z46YE-QywHIP8A=' })

      message.channel.send({ embeds: [helpCommands] });

    } catch (err) {
      console.log(err);
      message.reply('Error occurred while attempting to get help menu');
    }

  },
};
