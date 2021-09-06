module.exports = {
	name: 'getstats',
	description: 'Get Statistics about a player.',
	aliases: ['gets'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');

			const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);
			if (!args[0]) return message.channel.send(`Please enter a valid user.`);
			await hypixel.getPlayer(args[0])
			.then(player => {
			const statsEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setDescription(`Username/Nickname: **${player.nickname}**\nUUID: \`${player.uuid}\`\n\nPrevious Names: \`${player.history.join(', ')}\`\nRank: **${player.rank}**\nLevel: \`${player.level}\`\nOnline: \`${player.isOnline}\`\nKarma: \`${player.karma}\`\nTotal Wins: \`${player.achievements.generalWins}\`\nTotal XP: \`${player.achievementPoints}\``)
			.setFooter(config.name, config.icon)
			.setColor(config.emerald)
			.setTimestamp();
			message.channel.send({ embeds: [statsEmbed]});
			})
			.catch(err => {
				return message.channel.send(`This user does not exist or does not have a registered Hypixel Account.`)
			});

	}
}