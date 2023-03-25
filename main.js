const { Client, Intents, DiscordAPIError } = require('discord.js');
const { token } = require('./config.json');
Discord = require("discord.js");
const client = new Client({ intents: [32767] });
const prefix = '!';

client.once( 'ready', () => {
    console.log('Ready');
})

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))


for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix)  || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(token);