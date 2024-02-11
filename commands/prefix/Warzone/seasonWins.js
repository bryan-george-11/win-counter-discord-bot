const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "win",
        description: "Add wins for to the leaderboard",
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
            const updateSeason = userIds.map(userId => collection.updateOne({ _id: userId }, { $inc: { seasonWins: 1 } }, { upsert: true }));
            const updateCareer = userIds.map(userId => collection.updateOne({ _id: userId }, { $inc: { wins: 1 } }, { upsert: true }));
            await Promise.all(updateSeason, updateCareer);

            const rand = Math.random().toString(36).slice(2);

            // Get the updated win totals for each user from the database
            const users = await collection.find({ _id: { $in: userIds } }).toArray();
            const seasonWinTotals = users.map((user, index) => `${index + 1} - ${message.guild.members.cache.get(user._id).displayName}: ${user.seasonWins || 0}`).join('\n');

            let currentSeason = 'Warzone 3 Season 2'

            // Reply with the updated win totals for each user
            const winTrackerEmbed = new EmbedBuilder()
                .setColor('F1C40F')
                .setTitle(`COD ${currentSeason} Warzone Victory`)
                .setAuthor({ name: `${currentSeason} Win`, iconURL: 'https://as2.ftcdn.net/v2/jpg/01/39/31/79/1000_F_139317922_FAWtQJMMVOVvDeM2OVg0ofiwIvBUrrux.jpg' })
                .setDescription(`Win Totals Below Have now been updated:\n\n ${seasonWinTotals}`)
                .setThumbnail(`https://static.wikia.nocookie.net/callofduty/images/4/47/RankedPlay_Logo_MWII.png/revision/latest/scale-to-width-down/250?cb=20230227180441?${rand}`)
                .setTimestamp()

            message.channel.send({ embeds: [winTrackerEmbed] });
        } catch (err) {
            console.log(err);
            message.reply('Error occurred while updating win totals');
        }
    },
};
