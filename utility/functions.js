module.exports = (client, useDatabase) => {
    const Discord = require('discord.js');
    const times = x => f => {
        if (x > 0) {
            f()
            times(x - 1)(f)
        }
    }

    /**
     * Waits for the user to reply to a message, and returns the reply
     * @param {object} msg          The message object
     * @param {string} question     Question you want the user to reply to
     * @param {number} limit        How long it should wait for the reply before returning
     * @param {boolean} del         If you want to delete the message after they replied (optinal)
     */
    client.awaitReply = async (msg, question, limit, del) => {
        const filter = m => m.author.id === msg.author.id;
        const m = await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ["time"]
            });
            if (del) {
                m.delete();
                collected.first().delete()
            }
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };

    /**
     * Fetches command to enmap database
     * @param commandName Name fo the command to fetch
     */
    client.loadcommand = (commandName) => {
        try {
            const props = require(`./../commands/${commandName}`);
            client.commands.set(props.help.name, props);

            props.help.aliases.forEach(a => {
                client.aliases.set(a, props.help.name)
            });
        } catch (e) {
            console.log(`Unable to load ${commandName}: ${e}`)
        }
    }

    /**
     * Finds the index of argument in array that matches "|"
     * @param a Array of arguments
     */
    client.titleEnd = (a) => {
        let i = 1;
        while (i < a.length) {
            if (a[i].includes('|')) {
                return i
            }
            i++
        }
        return 0
    }
}