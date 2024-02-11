require('dotenv').config()
const { Client, Partials, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "Counting WZ Wins",
      type: ActivityType.Competing
    }],
    status: 'online'
  },
});

// User ID to whom you want to send the offline/online message
const userIdToNotify = process.env.MY_ID;

// Host the bot:
require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.BOT_TOKEN;
if (!AuthenticationToken) {
  console.warn("[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js.".red)
  return process.exit();
};

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// Function to send a direct message to a user
async function sendDirectMessage(userId, content) {
  const user = await client.users.fetch(userId);

  if (user) {
    try {
      await user.send(content);
      console.log('Direct message sent successfully!');
    } catch (error) {
      console.error('Error sending direct message:', error.message);
    }
  } else {
    console.error(`User with ID ${userId} not found.`);
  }
}


// Login to the bot:
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Something went wrong while connecting to your bot...");
    console.error("[CRASH] Error from Discord API:" + err);
    return process.exit();
  });

client.once('ready', () => {
  // Set bot avatar
  client.user.setAvatar('https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-head-robot-avatar-profile-vector-png-image_6631781.png')
    .then(() => console.log('Avatar set successfully!'))
    .catch(console.error);
});

client.once('disconnect', () => {
  // Bot went offline, send a direct message
  sendDirectMessage(userIdToNotify, '⚠️ **Bot Offline!** I have unexpectedly disconnected from Discord.');
});

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});
