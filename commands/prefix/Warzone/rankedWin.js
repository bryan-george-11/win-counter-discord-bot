const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "rankedwin",
        description: "Add wins for ranked games to the leaderboard",
    },
    permissions: ['SendMessages'],
    owner: false,
    run: async (client, message, args, prefix, config, database, db) => {
        try {
            // Get list of user IDs and increment their win totals in the database
            let userIds;
            if (message.mentions.users.size > 0) {
                userIds = message.mentions.users.map(user => user.id);
            } else {
                userIds = [message.author.id];
            }
            const collection = await database.collection(process.env.DB_COLLECTION_NAME);
            const updates = userIds.map(userId => collection.updateOne({ _id: userId }, { $inc: { rankedWins: 1 } }, { upsert: true }));
            await Promise.all(updates);

            // Get the updated win totals for each user from the database
            const users = await collection.find({ _id: { $in: userIds } }).toArray();
            const rankedWinTotals = users.map((user, index) => `${index + 1} - ${message.guild.members.cache.get(user._id).displayName}: ${user.rankedWins || 0}`).join('\n');

            // Reply with the updated win totals for each user
            const winTrackerEmbed = new EmbedBuilder()
                .setColor('F1C40F')
                .setTitle('COD Warzone Season 4 Ranked Warzone Victory')
                .setAuthor({ name: 'Warzone Ranked Win', iconURL: 'https://as2.ftcdn.net/v2/jpg/01/39/31/79/1000_F_139317922_FAWtQJMMVOVvDeM2OVg0ofiwIvBUrrux.jpg' })
                .setDescription(`Win Totals Below Have now been updated:\n\n ${rankedWinTotals}`)
                .setThumbnail('https://wzhub.gg/images/ranked-header-2.webp')
                .setFooter({ text: 'Ranked mode', iconURL: 'https://wzhub.gg/images/ranked-header-2.webp' })
                .setTimestamp()

            message.channel.send({ embeds: [winTrackerEmbed] });
        } catch (err) {
            console.log(err);
            message.reply('Error occurred while updating win totals');
        }
    },
};
