const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
  config: {
    name: "help",
    description: "Replies with help menu.",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix) => {
    const commands = client.prefix_commands.map(command => `${prefix}${command.config.name}`);

    return message.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Warzone Wins Discord Bot Help')
            .setColor('bf1919')
            .setDescription('Here are the available commands for this bot:')
            .addFields(
              { name: `${prefix}win`, value: 'Add a win for one or more users. If no users are mentioned, adds a win for the message author.' },
              { name: `${prefix}removewin`, value: 'Remove a win for a specific user.' },
              { name: `${prefix}leaderboard`, value: 'Show the top 5 users with the most wins.' },
              { name: `${prefix}resetAllWins`, value: 'Reset all win totals to 0.' },
            )
            .setTimestamp()
            .setAuthor({ name: 'Bot Helper', iconURL: 'https://media.istockphoto.com/id/1128516744/vector/robot-icon-bot-sign-design-chatbot-symbol-concept-voice-support-service-bot-online-support.jpg?s=612x612&w=0&k=20&c=Z8MetVg7f2qkrg6pEBl2LOvqGcZp8z46YE-QywHIP8A=' })
            .setThumbnail('https://media.istockphoto.com/id/1128516744/vector/robot-icon-bot-sign-design-chatbot-symbol-concept-voice-support-service-bot-online-support.jpg?s=612x612&w=0&k=20&c=Z8MetVg7f2qkrg6pEBl2LOvqGcZp8z46YE-QywHIP8A=')
          ]
      }
    );

  },
};
