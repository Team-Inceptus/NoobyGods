module.exports = {
	name: 'help',
	description: 'Displays help.',
	aliases: ['h', '?'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			const helpEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setColor(config.emerald)
			.setDescription(`I am NoobyBot, TheNoobyGod's Server Operator. Here are some of my commands:\n\n\`/getstats <player>\` - Get a user's stats. Enter a valid player name that has been registered on Hypixel.\n\n\`/skyblockstats <player>\` - Get skyblock statistics for a player. Same rules as /getstatus.\n\n\`/guildstats <player>\` - Get TheNoobyGods guild stats.\n\`/ping\` - Ping me!\n\`/leaderboard [leaderboard]\` - Get a weekly leaderboard. If none given, will default to GEXP.\n\`/bazaar\` - Enter the Bazaar Portal.\n\n\`/getrank <user> [sb-profile]\` - Get a user's Guild Score. Enter a Skyblock Profile to count skyblock scores. Score Counter:\n\`\`\`≤ 1,000 = Beginner\n1,000 to 2,100 = Experienced\n1,500 to 4,000 = Pro\n≥ 4,000 = Demi-Gods\`\`\``)
			.setFooter(config.name, config.icon)
			.setTimestamp();
			if (!args[0]) {
				message.channel.send({ embeds: [helpEmbed]});
			} else if (args[0].toLowerCase() == 'minecraft' || args[0].toLowerCase() == 'mc') {
				const helpMinecraftEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setDescription(`__Minecraft Help__\nThese are the commands you can use in-game in the guild chat!\nUsage:\n\`\`\`/gc <command>\n/gc /ping\`\`\`\n\`/ping\` - Get the bot's connection latency to the server.`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				message.channel.send({ embeds: [helpMinecraftEmbed]});
			} else {
				message.channel.send({ embeds: [helpEmbed]});
			}
		} catch (error) {
			console.error(error);
			message.reply(config.error);
		}
	}
}