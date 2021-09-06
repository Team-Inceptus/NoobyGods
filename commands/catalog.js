module.exports = {
	name: 'catalog',
	description: 'Guild SMP Cosmetics Catalog',
	aliases: ['ctlg', 'cosmetics', 'cosm', 'smpcosmetics', 'smpcatalog', 'cmts', 'catal'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		const timedOut = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(`This menu has timed out. Please use the command again.`)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const cosmeticsEmbed1 = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setTitle('Page 1 | Commands')
		.addFields(
			{ name: '/hat <block> | 100k', value: 'Set a supplied block on your head.'},
			{ name: '/lightning | 250k', value: 'Create a lightning affect for scenes or roleplay on your feet! (does no damage).'},
			{ name: '/bold | 200k', value: 'Set your name and tablist name to bold. Rejoin to disable.'},
			{ name: '/italic | 200k', value: 'Set your name and tablist name to italic. Rejoin to disable.'},
			{ name: '/underline | 200k', value: 'Set your name and tablist name to underlined. Rejoin to disable.'}
		)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const cosmeticsEmbed2 = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setTitle('Page 2 | Emojis')
		.setDescription('The emojis plugin can be found [here](https://www.spigotmc.org/resources/chatemojis.88027/).')
		.addFields(
			{ name: 'Mini Pack | 100k', value: '\`<3, :star:, :yes:, :no:\`'},
			{ name: 'Small Pack | 250k', value: 'Mini Pack + \`:java:, :arrow:, :shrug:, :tableflip:, o/, :), :(\`'},
			{ name: 'Regular Pack | 500k', value: 'Small Pack + \`:123:, :totem:, :typing:, :maths:, :snail:, :thinking:, :gimme:, :wizard:, :pvp:, :oof:, :puffer:, :playername:, :yey:\`'},
			{ name: 'Premium Pack | 1M', value: 'Every Emoji (Regular + \`UwU, OwO, :dj:, :music:, :facepalm:, :cute:, :skull:, :dab:, :cat:, :dog:, :sloth:, :snow:\`)'}
		)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const cosmeticsEmbed3 = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setTitle('Page 3 | ChatColor')
		.setDescription('The external ChatColor plugin can be found [here](https://www.spigotmc.org/resources/chatcolor.22692/).')
		.addFields(
			{ name: 'Basic Pack | 150k', value: 'Use all built-in minecraft text colors.'},
			{ name: 'Full Pack | 300k', value: 'Use all built-in minecraft text colors, plus the bold, underlined, italic, and strikethrough features.'},
			{ name: 'Premium Pack | 500k', value: 'Use all built-in minecraft text colors and modifiers, plus hex codes (allows for custom colors).'}
		)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		let pageNum = 1;
		let cosmeticsMessage = await message.channel.send({ embeds: [cosmeticsEmbed1]});

		cosmeticsMessage.react('↩️').then(() => cosmeticsMessage.react('⬅️')).then(() => cosmeticsMessage.react('➡️')).then(() => cosmeticsMessage.react('↪️')).then(() => cosmeticsMessage.react('❌'))
		let cosmeticsFilter = (reaction, user) => {
			return ['↩️', '⬅️', '➡️', '↪️', '❌'].includes(reaction.emoji.name) && message.author.id === user.id;
		}

		let cosmeticsCollector = cosmeticsMessage.createReactionCollector(cosmeticsFilter, { time: 300000 })

		cosmeticsCollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name == '↩️') {
				pageNum = 1;
				cosmeticsMessage.reactions.resolve('↩️').users.remove(message.author.id);
			}
			else if (reaction.emoji.name == '⬅️') {
				pageNum--;
				cosmeticsMessage.reactions.resolve('⬅️').users.remove(message.author.id);
			}
			else if (reaction.emoji.name == '➡️') {
				pageNum++;
				cosmeticsMessage.reactions.resolve('➡️').users.remove(message.author.id);
			}
			else if (reaction.emoji.name == '↪️') {
				pageNum = 3;
				cosmeticsMessage.reactions.resolve('↪️').users.remove(message.author.id);
			}
			else if (reaction.emoji.name == '❌') {
				cosmeticsCollector.stop();
			}

			if (pageNum == 1) {
				cosmeticsMessage.edit({ embeds: [cosmeticsEmbed1] });
			} else if (pageNum == 2) {
				cosmeticsMessage.edit({ embeds: [cosmeticsEmbed2] });
			} else if (pageNum == 3) {
				cosmeticsMessage.edit({ embeds: [cosmeticsEmbed3] });
			}
		})

		cosmeticsCollector.on('end', (collected) => {
			cosmeticsMessage.reactions.removeAll();
			cosmeticsMessage.edit(timedOut);
		})
	}
}