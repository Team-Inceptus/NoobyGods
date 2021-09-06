module.exports = {
	name: 'roles',
	description: 'Add self roles.',
	aliases: ['rl'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			if (!args[0]) {
				const rolesEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setDescription(`__Self Roles__\n\`/roles smp\` - <@&823080440365711360>\n\`/roles bot\` - <@&824736567184326666>\n\`/roles news\` - <@&836683798242000947>\n\`/roles reporter\` - <@&837727007831228438>`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				message.channel.send({ embeds: [rolesEmbed]});
			} else if (args[0].toLowerCase() == 'smp') {
				if (!message.member.roles.cache.has('823080440365711360')) {
					message.member.roles.add('823080440365711360');
					message.channel.send('Equipped \'SMP Announcements\'.');
				} else {
					message.member.roles.remove('823080440365711360');
					message.channel.send('Dequipped \'SMP Announcements\'.');
				}
			} else if (args[0].toLowerCase() == 'bot') {
				if (!message.member.roles.cache.has('824736567184326666'))	{		message.member.roles.add('824736567184326666');
					message.channel.send('Equipped \'Bot Updates\'.');
				} else {
					message.member.roles.remove('824736567184326666');
					message.channel.send('Dequipped \'Bot Updates\'.');
				}
			} else if (args[0].toLowerCase() == 'news') {
				if (!message.member.roles.cache.has('836683798242000947'))	{		message.member.roles.add('836683798242000947');
					message.channel.send('Equipped \'News Ping\'.');
				} else {
					message.member.roles.remove('836683798242000947');
					message.channel.send('Dequipped \'News Ping\'.');
				}
			} else if (args[0].toLowerCase() == 'reporter') {
				if (!message.member.roles.cache.has('837727007831228438'))	{		message.member.roles.add('837727007831228438');
					message.channel.send('Equipped \'Reporter Ping\'.');
				} else {
					message.member.roles.remove('837727007831228438');
					message.channel.send('Dequipped \'Reporter Ping\'.');
				}
			} else if (args[0].toLowerCase() == 'creation') {
				if (!message.member.roles.cache.has('844704147680133130'))	{		message.member.roles.add('844704147680133130');
					message.channel.send('Equipped \'Creations Ping\'.');
				} else {
					message.member.roles.remove('844704147680133130');
					message.channel.send('Dequipped \'Creations Ping\'.');
				}
			}
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}