const Discord = require("discord.js");
const client = new Discord.Client();
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);


const loginToken = "TOKEN HERE"

const Enmap = require("enmap");
client.commands = new Enmap();
client.aliases = new Enmap();
client.prefixes = new Enmap();
client.ImageOnly = new Enmap({
    name: "channels"
});
client.automod = new Enmap({
    name: "automod"
})
client.steam = new Enmap({
    name: "steam"
})
client.logchn = new Enmap({
    name: "logchn"
})

client.on("ready", async () => {
    const cmdFiles = await readdir("./commands/");
    let i = 0;
    cmdFiles.forEach(f => {
        client.loadcommand(f);
        i++;
    });
    console.log(`Loaded ${i} commands`);

    i = 0
    client.guilds.cache.forEach(guild => {
        client.prefixes.set(guild.id, ".")
        i++
    })
    console.log(`Loaded ${i} guilds`)
    console.log(`Bot has started`);
    client.user.setActivity("Volcanoids", {
        type: "PLAYING"
    });

});

require("./utility/functions.js")(client);

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!newMessage.guild) return;
    if (newMessage.author.bot) return;

    if (oldMessage.author.bot || newMessage.author.bot) return;
    let prefix = client.prefixes.get(newMessage.guild.id);
    let args = newMessage.content
        .slice(prefix.length)
        .trim()
        .split(" ");
    let command = args.shift().toLowerCase();

    // Permissions
    let permlvl = 0;
    try {
        if (newMessage.member.permissions.has("MANAGE_MESSAGES", true)) permlvl = 1;
        if (newMessage.member.permissions.has("ADMINISTRATOR", true)) permlvl = 2;
    } catch (e) {
        console.log(newMessage.author + "\n\nCaused:\n\n" + e)
    }
    if (newMessage.author.id == "188762891137056769") permlvl = 6;

    let evtFiles = await readdir("./messageEvents")
    evtFiles.forEach(file => {
        const event = require(`./messageEvents/${file}`)
        event.run(client, newMessage, command, prefix, permlvl)
    })
})

client.on("message", async message => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!client.logchn.has(message.guild.id)) client.logchn.set(message.guild.id, 'disabled')

    let prefix = client.prefixes.get(message.guild.id);
    let msg = message.content.toUpperCase();
    let args = message.content
        .slice(prefix.length)
        .trim()
        .split(" ");
    let command = args.shift().toLowerCase();
    let timestamp = new Date().toLocaleString();
    message.guild.members.fetch(message.author);

    // Permissions
    let permlvl = 0;
    try {
        if (message.member.permissions.has("MANAGE_MESSAGES", true)) permlvl = 1;
        if (message.member.permissions.has("ADMINISTRATOR", true)) permlvl = 2;
    } catch (e) {
        console.log(message.author + "\n\nCaused:\n\n" + e)
    }
    if (message.author.id == "188762891137056769") permlvl = 6;


    let evtFiles = await readdir("./messageEvents")
    evtFiles.forEach(file => {
        const event = require(`./messageEvents/${file}`)
        event.run(client, message, command, prefix, permlvl)
    })

    // Command handler 

    if (!msg.startsWith(prefix)) return;
    let cmd =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    if (cmd.help.permLvl > permlvl)
        return message.channel.send(
            "You dont have the permission to use this command!"
        );
    if (message.guild.id !== "444244464903651348") {
        if (cmd.help.category == "volc" && permlvl < 5) return;
    }

    console.log(`| ${timestamp} | ${message.guild} | ${message.author.tag} | ${cmd.help.name}`);
    cmd.run(client, message, args, prefix, permlvl);
});

client.on("error", console.error);
client.login(loginToken);