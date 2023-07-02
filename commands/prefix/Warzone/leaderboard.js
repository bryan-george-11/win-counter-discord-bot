const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "leaderboard",
    description: "Shows the leaderboard of the server",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, database, db) => {
    try {
      const collection = await database.collection(process.env.DB_COLLECTION_NAME);
      const top5 = await collection.find().sort({ wins: -1 }).limit(5).toArray();
      console.log("🚀 ~ file: leaderboard.js:20 ~ run: ~ top5:", top5)
      const leaderboard = top5.map((user, index) => `${index + 1} - <@${user._id}> - ${user.wins} wins`).join('\n');
      const firstPerson = top5[0]._id
      const theLeader = client.users.cache.get(firstPerson);

      // Reply with the top 5 leaderboard
      const leaderboardEmbed = new EmbedBuilder()
        .setColor('F1C40F')
        .setTitle('COD Warzone Season 4 Wins Leaderboard')
        .setAuthor({ name: 'Top 5 Leaderboard', iconURL: 'https://as2.ftcdn.net/v2/jpg/01/39/31/79/1000_F_139317922_FAWtQJMMVOVvDeM2OVg0ofiwIvBUrrux.jpg' })
        .setDescription(`Top 5 Win Totals:\n${leaderboard}`)
        .setThumbnail(theLeader.avatarURL({ format: 'png', size: 4096 }))
        .setImage('https://imgsvc.trackercdn.com/url/size(1280x720),fit(cover),quality(100)/https%3A%2F%2Ftrackercdn.com%2Fghost%2Fimages%2F2023%2F6%2F1373_MW2-Warzone-Season-4-Key-Art-Featured-Operator.jpg/image.jpg')
        .setTimestamp()

      message.channel.send({ embeds: [leaderboardEmbed] })
        .then(reply => {
          message.channel.messages.fetchPinned() // fetches all pinned messages in the channel
            .then(pins => {
              pins.forEach(pin => pin.unpin()); // unpins all pinned messages in the channel
            })
            .catch(console.error)
            .then(() => {
              reply.pin({ reason: 'Pinned by bot' }) // pins the message with a reason
                .then(pinnedMessage => {
                  const customMessage = `Pinned Most Recent Leaderboard`; // creates a custom message
                  pinnedMessage.edit(customMessage) // modifies the pinned message to include the custom message
                    .catch(console.error);
                })
            })
            .catch(console.error);
        })
        .catch(console.error);
    } catch (err) {
      console.log(err);
      message.reply('Error occurred while getting leaderboard');
    }
  },
};
