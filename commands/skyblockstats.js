module.exports = {
	name: 'skyblockstats',
	description: 'Get Statistics about a member\'s skyblock.',
	aliases: ['sbs', 'skyblocks'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');

			const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);
			if (!args[0]) return message.channel.send(`Please enter a valid user.`);
			await hypixel.getSkyblockProfiles(args[0])
			.then(async prof => {
				/*
				
				*/
				let profiles = [];
				let i = prof.length - 1;
				while (i > -1) {
					let sbProf = prof[i].profileName;
					profiles.push(sbProf);
					i--;
				}
				function capitalize(str) {
  				return str.charAt(0).toUpperCase() + str.slice(1);
				}

				const profileEmbed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setColor(config.emerald)
				.setDescription(`Player \`${args[0]}\` has \`${prof.length}\` profiles. Enter a valid profile. \nValid Profiles Include:\n\`\`\`${profiles.join(', ')}\`\`\`\nWill time out in 120 seconds.`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				const profM = await message.channel.send({ embeds: profileEmbed});
				const mfilter = m => !m.author.bot && m.author.id === message.author.id;
				const messageCollector = message.channel.createMessageCollector(mfilter, { time: 120000 });
				messageCollector.on('collect', async (m) => {
					let profile = capitalize(m.content);
					await hypixel.getSkyblockMember(args[0]).then(member => {
						let player = member.get(profile);
						const statsEmbed = new Discord.MessageEmbed()
						.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
						.setDescription(`\n**General**\nStats:\n> Purse: \`${player.stats.purse}\`\n> Kills: \`${player.stats.kills}\`\n> Deaths: \`${player.stats.deaths}\`\n> Highest Crit: **${player.stats.highestCriticalDamage}**\n\nSkills:\n> Farming Level: \`${player.skills.farming.level}\`\n> Mining Level: \`${player.skills.mining.level}\`\n> Combat Level: \`${player.skills.combat.level}\`\n> Foraging Level: \`${player.skills.foraging.level}\`\n> Fishing Level: \`${player.skills.fishing.level}\`\n> Enchanting Level: \`${player.skills.enchanting.level}\`\n> Alchemy Level: \`${player.skills.alchemy.level}\`\n> Taming Level: \`${player.skills.taming.level}\`\n> Runecrafting Level: \`${player.skills.runecrafting.level}\`\n> Carpentry Level: \`${player.skills.carpentry.level}\`\n\nSlayers:\n> Zombie: \`${player.slayer.zombie.level}\`\n> Spider: \`${player.slayer.spider.level}\`\n> Wolf: \`${player.slayer.wolf.level}\``)
						.setColor(config.emerald)
						.setFooter(config.name, config.icon)
						.setTimestamp();
						message.channel.send({ embeds: [statsEmbed]});
					}).catch(err => {
						message.channel.send(`There was an error fetching some things. Make sure you have your API on!`)
					});
				})
				messageCollector.on('end', (collected) => {
					profileEmbed.setDescription(`This message has timed out. Please use the command again.`)
					profM.edit(profileEmbed);
				})
			})
			.catch(error => {
				message.channel.send(`There was an error fetching that player. Perhaps you misspelled his name?`)
				console.error(error);
			});

	}
}