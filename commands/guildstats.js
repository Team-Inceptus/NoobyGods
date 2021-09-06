module.exports = {
	name: 'guildstats',
	description: 'Get Statistics about the guild',
	aliases: ['guilds'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);
		const guild = await hypixel.getGuild('player', 'GamerCoder215');

		const statsEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(`Name: **${guild.name}**\nID: \`${guild.id}\`\n\nAchievements:\n> Winners: ${guild.achievements.winners}\n> EXP Kings: ${guild.achievements.experienceKings}\n\nLevel: \`${guild.level}\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();
		message.channel.send({ embeds: [statsEmbed]});
	}
}