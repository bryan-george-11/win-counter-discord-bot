const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "setchannel",
        description: "Set the channel for the guild.",
        usage: "setchannel #your-channel"
    },
    permissions: ['Administrator'],
    owner: false,
    run: async (client, message, args, prefix, config, db) => {

        try {
            // Command to set the allowed channel
            const channel = message.mentions.channels.first();
            if (!channel) {
                message.reply('Please mention a valid channel.');
                return;
            }
            allowedChannelId = channel.id;
            message.reply(`Bot commands are now allowed in ${channel}.`);

        } catch (err) {
            console.log(err);
            message.reply('Error occurred while attempting to get help menu');
        }

    },
};
