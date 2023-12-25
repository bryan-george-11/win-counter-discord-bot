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
      const seasonTop5 = await collection.find().sort({ seasonWins: -1 }).limit(5).toArray();
      const careerTop5 = await collection.find().sort({ wins: -1 }).limit(5).toArray();
      const leaderboard = careerTop5.map((user, index) => `${index + 1} - <@${user._id}> - ${user.wins} wins`).join('\n');
      const firstPerson = careerTop5[0]._id
      const theLeader = client.users.cache.get(firstPerson);

      const seasonLeaderboard = seasonTop5.map((user, index) => `${index + 1} - <@${user._id}> - ${!user.seasonWins ? `_Do you think you'll ever manage to get a win?_` : user.seasonWins + `${user.seasonWins === 1 ? ` win` : ` wins`}`}`).join('\n');
      const seasonFirstPerson = seasonTop5[0]._id
      console.log("🚀 ~ file: leaderboard.js:21 ~ run: ~ seasonLeaderboard:", seasonLeaderboard)
      const theSeasonLeader = client.users.cache.get(seasonFirstPerson);

      

      let currentSeason = 'Warzone 3 Season 1'
      const rand = Math.random().toString(36).slice(2);

      // Reply with the top 5 leaderboard
      const leaderboardEmbed = new EmbedBuilder()
        .setColor('F1C40F')
        .setTitle(`COD ${currentSeason} Wins Leaderboard`)
        .setAuthor({ name: 'Leaderboard', iconURL: 'https://as2.ftcdn.net/v2/jpg/01/39/31/79/1000_F_139317922_FAWtQJMMVOVvDeM2OVg0ofiwIvBUrrux.jpg' })
        .setDescription(`**_${currentSeason} Win Totals:_**\n${seasonLeaderboard} \n\n **_Career Win Totals:_**\n${leaderboard} \n\n`)
        .setThumbnail(theSeasonLeader.avatarURL({ format: 'png', size: 4096 }))
        .setImage(`https://www.charlieintel.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.charlieintel.com/wp-content/uploads/2023/12/06/season-1-modern-warfare-3-update.jpg?${rand}`)
        .setFooter({ text: 'Victory', iconURL: `https://static.wikia.nocookie.net/callofduty/images/4/47/RankedPlay_Logo_MWII.png/revision/latest/scale-to-width-down/250?cb=20230227180441?${rand}` })
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
