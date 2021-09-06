module.exports = {
	name: 'send',
	description: 'Send a message to a channel.',
	aliases: ['snd', 'sendmessage'],
	owner: true,
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			const channel = client.channels.cache.get(args[0]);
			if (!channel) return message.channel.send(`This user does not exist.`);

			const msg = args.slice(1).join(' ');
			channel.startTyping()
			setTimeout(() => {
			channel.send(msg);
			channel.stopTyping()
			}, 3000)
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}