module.exports = {
	name: 'listemmebers',
	description: 'Gets a list of guild members.',
	aliases: ['listmem'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');
		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);

		const guild = await hypixel.getGuild('player', 'GamerCoder215');
		try {
		let players = [];
		let i = 0;
		while (i < guild.members.length) {
			let player = await hypixel.getPlayer(guild.members[i].uuid);
			players.push(player.nickname);
			i++;
		};

		const guildEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(players)
		.setFooter(config.name, config.icon)
		.setTimestamp();
		message.channel.send({ embeds: [guildEmbed]});
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}