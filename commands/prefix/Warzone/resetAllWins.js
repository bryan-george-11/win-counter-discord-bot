const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "resetallwins",
        description: "Reset All Wins for Everyone",
    },
    permissions: ['SendMessages'],
    owner: false,
    run: async (client, message, args, prefix, config, database, db) => {
        try {
            // Delete all documents in the "users" collection to reset all win totals
            // Check if they have admin role
            // update this to check for the role name you want to pass
            const adminRole = "Admin"

            if (message.guild.roles.cache.find(role => role.name === adminRole)) {
                const collection = await database.collection(process.env.DB_COLLECTION_NAME);
                const result = await collection.deleteMany({});
                console.log(`Deleted ${result.deletedCount} documents`);
                message.reply(`All win totals have been reset!`);
            }
            else {
                message.reply(`Sorry you do not have the right permissions to run this command`);
            }
        } catch (err) {
            console.log(err);
            message.reply('Error occurred while resetting win totals');
        }
    },
};
