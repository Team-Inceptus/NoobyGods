module.exports = {
	name: 'smp',
	description: 'SMP Admin Commands.',
	aliases: ['smpcommand', 'sc'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		if (!message.member.roles.cache.has('821184343065100338')) {
			message.channel.send('You need to have the SMP OP role to use SMP Admin Commands!')
		} else {
			if (!args[0]) return message.channel.send('Please provide an action!');

			if (args[0] == 'register') {
				if (!args[1]) return message.channel.send('Provide something to register.')

				if (args[1] == 'ban') {
					if (!args[2]) return message.channel.send('Please provide the user\'s IGN that was banned.');

					let user = args[2];

					if (!args[3]) return message.channel.send('Please provide the class level.');
					let situationLevel = args[3].toUpperCase();

					if (!args[4]) return message.channel.send('Please provide the reason the user was banned!')
					let reason = args.slice(4).join(' ');

					const banCaseEmbed = new Discord.MessageEmbed()
					.setColor(config.red)
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
					.setTitle(`Case BAN | Class ${situationLevel}`)
					.setDescription(`User: ${user}\nReason: \`${reason}\``)
					.setFooter(config.name, config.icon)
					.setTimestamp();

					client.channels.cache.get('856971466130456596').send({ embeds: [banCaseEmbed]});
					message.channel.send('Record sent sucesfully.');
				} else if (args[1] == 'suspension') {
					if (!args[2]) return message.channel.send('Please provide the user\'s IGN that was banned.');

					let user = args[2];

					if (!args[3]) return message.channel.send('Please provide the amount of time the user is suspended for.');
					let time = args[3];

					if (!args[4]) return message.channel.send('Please provide the class siutation level.');
					let situationLevel = args[4].toUpperCase();

					if (!args[5]) return message.channel.send('Please provide the reason the user was suspended!')
					let reason = args.slice(5).join(' ');

					const suspensionCaseEmbed = new Discord.MessageEmbed()
					.setColor('#ffa700')
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
					.setTitle(`Case SUSPENSION | Class ${situationLevel}`)
					.setDescription(`User: ${user}\nReason: \`${reason}\`\nTime: \`${time}\``)
					.setFooter(config.name, config.icon)
					.setTimestamp();

					client.channels.cache.get('856971466130456596').send({ embeds: [suspensionCaseEmbed]});
					message.channel.send('Record sent sucesfully.');
				}
			} else if (args[0] == 'schedule') {
				if (!(args[1])) return message.channel.send('Please provide "maintenance" or "restart".');
				if (!(args[1] == 'maintenance') && !(args[0] == 'restart')) return message.channel.send('Please provide "maintenance" or "restart".');

				if (!(args[2])) return message.channel.send('Please provide a length.');

				if (!(args[3])) return message.channel.send('Please provide a valid description.');

				let desc = args.slice(3).join(' ');

				const scheduledEmbed = new Discord.MessageEmbed();
				scheduledEmbed.setColor(config.yellow)
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setTitle(`⚠️ Scheduled ${args[1].toUpperCase()} ⚠️`)
				.setDescription(`Duration: \`${args[2]}\`\nDescription: \`\`\`${desc}\`\`\``)
				.setFooter(`${config.name} || SMP`, config.icon)
				.setTimestamp();

				const msg = await client.channels.cache.get('853411281565646889').send({ embeds: [scheduledEmbed]});

				msg.crosspost();
			}
		}
	}
}