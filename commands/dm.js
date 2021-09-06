module.exports = {
	name: 'dm',
	description: 'DM a user.',
	aliases: ['directmessage', 'msg'],
	owner: true,
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			const user = client.users.cache.get(args[0]);
			if (!user) return message.channel.send(`This user does not exist.`);

			const msg = args.slice(1).join(' ');

			user.send(msg);
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}