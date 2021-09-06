module.exports = {
	name: 'ping',
	description: 'Pings the bot.',
	aliases: ['png'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			let ping = Date.now() - message.createdTimestamp;

			message.channel.send(`Pong! Latency is ${ping}ms`)
		} catch (error) {
			message.reply(config.error);
			console.error(error);
		}
	}
}