const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const { MongoClient } = require('mongodb');
const { re } = require("mathjs");
const uri = process.env.MONGODB_TOKEN;
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  name: "messageCreate"
};

(async () => {
  try {
    await dbClient.connect();
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

client.on('messageCreate', async (message) => {

  if (message.channel.type !== 0) return;
  if (message.author.bot) return;


  const database = await dbClient.db('warzoneWinsDB');
  const prefix = await db.get(`guild_prefix_${message.guild.id}`) || config.Prefix || "?";

  if (!message.content.startsWith(prefix)) {
    message.reply('Only -win and -leaderboard are accepted commands for this channel. This message will be self destruct in 5 seconds!')
      .then(msg => {
        setTimeout(() => msg.delete(), 5000)
        setTimeout(() => message.delete().then(() => console.log(`Deleted message from ${message.author.tag} because it did not start with "${prefix}" and was ${message.content}`)), 5000)
      })
      .catch(console.error);
  }

  //if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  console.log("🚀 ~ file: messageCreate.js:38 ~ client.on ~ args:", args)
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`🚫 Unfortunately, you are not authorized to use this command.`)
            .setColor("Red")
        ]
      })
    };

    if (command.owner, command.owner == true) {
      if (config.Users?.OWNERS) {
        const allowedUsers = []; // New Array.

        config.Users.OWNERS.forEach(user => {
          const fetchedUser = message.guild.members.cache.get(user);
          if (!fetchedUser) return allowedUsers.push('*Unknown User#0000*');
          allowedUsers.push(`${fetchedUser.user.tag}`);
        })

        if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(", ")}**`)
              .setColor("Red")
          ]
        })
      }
    };

    try {
      command.run(client, message, args, prefix, config, database, db);
    } catch (error) {
      console.error(error);
    };
  }
    
});
