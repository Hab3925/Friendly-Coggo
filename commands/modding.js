const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
  const moddingJSON = require("../storage/modding.json");
  let globalArray;
  if (!args[0]) {
    message.channel.send(
      `Learning to Mod? Check out the Modding Guide and FAQ! \nOur Modding Guide is at https://modding.melodicalbuild.me \nOur in Discord FAQ is found here! <#831103119252520960>`
    );
  } else {
    // moddingJSON.data.forEach((element) => {
    //   element.searchTerms.forEach((element2) => {
    //     if (element2 == args[0].toLowerCase()) {
    //       globalArray = moddingJSON.baseURL + element.url;
    //     } else {
    //       element.data.forEach((element3) => {
    //         element3.searchTerms.forEach((element4) => {
    //           if (element4 == args[0].toLowerCase()) {
    //             globalArray = moddingJSON.baseURL + element3.url;
    //           } else {
    //             element3.data.forEach((element5) => {
    //               element5.searchTerms.forEach((element6) => {
    //                 if (element6 == args[0].toLowerCase()) {
    //                   globalArray = moddingJSON.baseURL + element5.url;
    //                 } else {
    //                   if (globalArray == null) {
    //                     globalArray =
    //                       "Your Search Term was not found, Try again!";
    //                   }
    //                 }
    //               });
    //             });
    //           }
    //         });
    //       });
    //     }
    //   });
    // });

    var needle = args[0].toLowerCase();
    var foundEntries = []; // Whatever the JS version is.

    moddingJSON.data.forEach((dataEntry) => {
      dataEntry.searchTerms.forEach((haystackElement) => {
        if (haystackElement == needle || haystackElement.includes(needle)) {
          foundEntries.push(dataEntry);
        }
      });
    });

    let embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter(
        "Friendly Coggo",
        client.user.avatarURL({ format: "png", size: 2048 })
      );

    if (foundEntries.length > 0) {
        embed.setColor("#0cc20f");
      foundEntries.forEach(element => {
          embed.addField("Search Results:", moddingJSON.baseURL + element.url);
      })
    } else {
      embed.setColor("#b80000");
      embed.addField(
        "Search Results:",
        "Your Search Term was not found, Try again!"
      );
    }

    // if (globalArray == "Your Search Term was not found, Try again!") {
    //   embed.setColor("#b80000");
    //   embed.addField("Search Results:", globalArray);
    // } else {
    //   embed.setColor("#0cc20f");
    //   embed.addField("Search Results:", globalArray);
    // }

    message.channel.send(embed);
  }
};

exports.help = {
  name: "modding",
  desc: "Open the Modding FAQ",
  aliases: ["mod"],
  permLvl: 0,
  hidden: true,
  category: "volc",
  usage: "modding <guide name>",
};
