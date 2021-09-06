module.exports = {
	name: 'getinactive',
	description: 'Get inactive players.',
	aliases: ['getinactiveplayes', 'inactiveplayers', 'getinactp', 'getinactivep'],
	admin: true,
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');
		const fetch = require('node-fetch');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);
		try {
			let awaitMsg = await message.channel.send('Calculating...');
			fetch(`https://api.hypixel.net/guild?player=8069233e-5b25-410c-9475-daa6a044c365&key=${process.env.HYPIXEL_TOKEN}`)
			.then(res => res.json())
			.then(async data => {
				let formMembers = [];
				let members = data.guild.members;
				function sort(item, index) {
					formMembers.push(item.uuid)
				}
				members.forEach(sort);
				
				let topInactive = [];

				let i = 0;
				while (i < members.length) {
					let guildMP = await hypixel.getPlayer(formMembers[i]);
					topInactive.push({
						login: guildMP.lastLogoutTimestamp,
						name: guildMP.nickname
					})
					i++;
				}
				function filterTwoWeeks(item) {
					return (Date.now() - item.login >= 1209600000);
				}
				let filteredTopInactive = topInactive.filter(filterTwoWeeks);
				let topInactiveNames = [];

				function formatTop(item, index) {
					topInactiveNames.push(item.name);
				}
				filteredTopInactive.forEach(formatTop);
				const inactiveEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setDescription(`__Players inactive longer than 2 weeks__\n\`\`\`\n${topInactiveNames.join('\n')}\`\`\``)
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setFooter(config.name, config.icon)
				.setTimestamp();
				
				awaitMsg.delete();
				message.channel.send({ embeds: [inactiveEmbed]});
			})
		} catch (err) {
			console.error(err);
		}
	}
}