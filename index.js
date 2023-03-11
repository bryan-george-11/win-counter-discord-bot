//Importing all needed Commands
require('dotenv').config(); //this package is for using .env files, which we use for our Bot Token and some other things
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors");
const { GatewayIntentBits } = require("discord.js");
//this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ]
});

//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
console.log("🚀 ~ file: index.js:43 ~ client.commands:", client.commands)
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
console.log("🚀 ~ file: index.js:45 ~ client.aliases:", client.aliases)
client.categories = fs.readdirSync("./commands/"); //categories
console.log("🚀 ~ file: index.js:47 ~ client.categories:", client.categories)
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user
console.log("🚀 ~ file: index.js:49 ~ client.cooldowns:", client.cooldowns)

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
//login into the bot

client.login(process.env.BOT_TOKEN);

