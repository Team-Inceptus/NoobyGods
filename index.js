// Events / Pre-Command Stuff
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_INTEGRATIONS", "GUILD_MESSAGES"] });
const mineflayer = require('mineflayer');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const bot = mineflayer.createBot({
  host: 'mc.hypixel.net',
  username: process.env.EMAIL, 
  password: process.env.PASSWORD,
	auth: 'microsoft',
	version: '1.8.9'
});

// Handlers

// Mineflayer Handler
fs.readdir('./mineflayer/', (err, files) => {
    if (err) return console.error(err); // Catch any errors
    files.forEach(file => {
        // Detect if JavScript file
        if (!file.endsWith('.js')) return;
        // Get the event
        const event = require(`./mineflayer/${file}`);
        // Get the event's name
        const eventName = file.split('.')[0];
        // Bind the event to the bot
        bot.on(eventName, event.bind(null, bot));
    });
});

// Command Handler
client.commands = new Discord.Collection();
client.slashcommands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const slashCommands = [];

const slashcommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));
for (const file of slashcommandFiles) {
	const scommand = require(`./slash-commands/${file}`);
	client.slashcommands.set(scommand.data.name, scommand);
	slashCommands.push(scommand.data.toJSON());
}


module.exports = { client, bot };

// Event Handler
fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		// If the file is not .js, it ignores
		if (!file.endsWith('.js')) return;
		// Load the event file
		const event = require(`./events/${file}`);
		// Get event from file name
		const eventName = file.split('.')[0];

		client.on(eventName, event.bind(null, client));
	});
});
// Server
require("express")().use(require("express").static(__dirname + "/web")).listen(8080)
console.log('Server has been hosted.');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands('801507617163837479', '801500237310984252'),
			{ body: slashCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.TOKEN)