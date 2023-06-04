const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "removewin",
        description: "Remove a win from a user",
    },
    permissions: ['SendMessages'],
    owner: false,
    run: async (client, message, args, prefix, config, database, db) => {
        try {
            // Get the user ID to remove a win from
            const userId = message.mentions.users.first().id;

            // Decrement the user's win total in the database
            const collection = await database.collection(process.env.DB_COLLECTION_NAME);
            const result = await collection.updateOne({ _id: userId }, { $inc: { wins: -1 } });
            if (result.modifiedCount === 0) {
                message.reply(`User <@${userId}> has not won any games`);
            } else {
                // Get the updated win total for the user from the database
                const user = await collection.findOne({ _id: userId });
                const winTotal = user.wins || 0;

                // Reply with the updated win total for the user
                message.reply(`Removed a win from <@${userId}>. New win total: ${winTotal}`);
            }
        } catch (err) {
            console.log(err);
            message.reply('You must mention a user to remove a win from');
        }
    },
};
