const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help about the bot\'s commands.')
		.addBooleanOption(option => option.setName('minecraft-help').setDescription('Use In-Game Commands. Default: false.')),
	async run(client, interaction) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			const helpEmbed = new Discord.MessageEmbed()
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setColor(config.emerald)
			.setDescription(`I am NoobyBot, TheNoobyGod's Server Operator. Here are some of my commands:\n\n\`/getstats <player>\` - Get a user's stats. Enter a valid player name that has been registered on Hypixel.\n\n\`/skyblockstats <player>\` - Get skyblock statistics for a player. Same rules as /getstatus.\n\n\`/guildstats <player>\` - Get TheNoobyGods guild stats.\n\`/ping\` - Ping me!\n\`/leaderboard [leaderboard]\` - Get a weekly leaderboard. If none given, will default to GEXP.\n\`/bazaar\` - Enter the Bazaar Portal.\n\n\`/getrank <user> [sb-profile]\` - Get a user's Guild Score. Enter a Skyblock Profile to count skyblock scores. Score Counter:\n\`\`\`≤ 2,500 = Beginner\n2,500 to 6,800 = Experienced\n6,800 to 10,000 = Pro\n≥ 10,000 = Demi-Gods\`\`\``)
			.setFooter(config.name, config.icon)
			.setTimestamp();
			if (!interaction.options.getBoolean('minecraft-help')) {
				await interaction.reply({ embeds: [helpEmbed]});
			} else {
				const helpMinecraftEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setDescription(`__Minecraft Help__\nThese are the commands you can use in-game in the guild chat!\nUsage:\n\`\`\`/gc <command>\n/gc /ping\`\`\`\n\`/ping\` - Get the bot's connection latency to the server.`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				await interaction.reply({ embeds: [helpMinecraftEmbed]});
			}
		} catch (error) {
			console.error(error);
			await interaction.reply(config.error);
		}
	}
}