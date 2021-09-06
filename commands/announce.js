module.exports = {
	name: 'announce',
	description: 'Makes a public announcement.',
	aliases: ['ann', 'announcement'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			if (!message.member.roles.cache.has('801501790939906048')) return message.channel.send('Only Admins can make announcements.');
			let msg = args.slice(0).join(' ');
			if (!msg) return message.channel.send('Please provide an announcement.');

			const announceEmbed = new Discord.MessageEmbed()
			.setColor(config.emerald)
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setDescription(msg)
			.setFooter(config.name, config.icon)
			.setTimestamp();
			client.channels.cache.get('801510666191110184').send({ content: `@everyone`, embeds: [announceEmbed]});
		} catch (error) {
			console.error(error);
			message.reply(config.error);
		}
	}
}