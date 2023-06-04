const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "win",
        description: "Add wins to the leaderboard",
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
            const updates = userIds.map(userId => collection.updateOne({ _id: userId }, { $inc: { wins: 1 } }, { upsert: true }));
            await Promise.all(updates);

            // Get the updated win totals for each user from the database
            const users = await collection.find({ _id: { $in: userIds } }).toArray();
            const winTotals = users.map((user, index) => `${index + 1} - ${message.guild.members.cache.get(user._id).displayName}: ${user.wins || 0}`).join('\n');

            // Reply with the updated win totals for each user
            const winTrackerEmbed = new EmbedBuilder()
                .setColor('F1C40F')
                .setTitle('COD Warzone Season 2 Warzone Victory')
                .setAuthor({ name: 'Warzone Victory', iconURL: 'https://as2.ftcdn.net/v2/jpg/01/39/31/79/1000_F_139317922_FAWtQJMMVOVvDeM2OVg0ofiwIvBUrrux.jpg' })
                .setDescription(`Win Totals Below Have now been updated:\n\n ${winTotals}`)
                .setThumbnail(client.user.displayAvatarURL(({ format: 'png', size: 4096 })))
                //.setImage('https://cdn.oneesports.gg/cdn-data/2022/12/MW2_Season2_Ronin-1024x576.webp')
                .setTimestamp()
            //.setFooter({ text: 'Season 2', iconURL: message.user.avatarURL({ format: 'png', size: 4096 }) });

            message.channel.send({ embeds: [winTrackerEmbed] });
        } catch (err) {
            console.log(err);
            message.reply('Error occurred while updating win totals');
        }
    },
};
