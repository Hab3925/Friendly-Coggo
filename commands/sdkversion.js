const axios = require('axios');
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if(!args[0]) {
        let obj = axios
          .get(
            "https://api.nuget.org/v3-flatcontainer/volcanoidssdk/index.json"
          )
          .then((element) => {
            let lobj = element.data.versions[element.data.versions.length - 1];

            let embed = new Discord.MessageEmbed()
              .setTitle("Volcanoids SDK Version:")
              .setTimestamp()
              .setFooter(
                "Friendly Coggo",
                client.user.avatarURL({ format: "png", size: 2048 })
              )
              .setURL(`https://nuget.org/packages/VolcanoidsSDK/${lobj}`)
              .addField("Current Version: ", lobj);

            message.channel.send(embed);
          });
    } else {
        let obj = axios
          .get(
            "https://api.nuget.org/v3-flatcontainer/volcanoidssdk/index.json"
          )
          .then((element) => {
            let lobj = element.data.versions[element.data.versions.length - 1];

            let embed = new Discord.MessageEmbed()
              .setTitle("Volcanoids SDK Version:")
              .setTimestamp()
              .setFooter(
                "Friendly Coggo",
                client.user.avatarURL({ format: "png", size: 2048 })
              )
              .setURL(`https://nuget.org/packages/VolcanoidsSDK/${args[0]}`)
              .addField("Current Version: ", lobj)
              .addField("Selected Version: ", args[0]);

            message.channel.send(embed);
          });
    }
};

exports.help = {
  name: "sdkversion",
  desc: "Make cap",
  aliases: ["version", "v"],
  permLvl: 0,
  hidden: true,
  category: "volc",
  usage: "sdkversion",
};
