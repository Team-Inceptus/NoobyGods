module.exports = {
	name: 'suggest',
	description: 'Make a suggestion',
	aliases: ['suggestion', 'sug'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			if (message.channel.id !== '805165613202931723') return message.channel.send('Suggestion commands can only be made in <#805165613202931723>. (Suggestions are mainly for the SMP, server updates will be done with polls.)');

			if (message.content.length < 30 || message.content.length > 500) return message.channel.send(`Suggestions must be detailed, but simple, so make sure you have at least 30 characters and below 500.`);
			const suggestion = args.slice(0).join(' ');
			const suggestionEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setDescription(`Suggestion:\n${suggestion}`)
			.setFooter(config.name, config.icon)
			.setColor(config.emerald)
			.setTimestamp();
			const msg = await client.channels.cache.get('816721936913793025').send({embeds: [suggestionEmbed]});
			message.channel.send(`Suggestion sent sucessfully.`);
			msg.react('✅').then(() => msg.react('❌'));
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}