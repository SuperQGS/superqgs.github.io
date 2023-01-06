const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', message => {
  if (message.channel.type === 'dm') {
    message.reply(`test ${message.content}`);
  }
});

client.login('');