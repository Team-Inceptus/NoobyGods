module.exports = {
	name: 'leaderboard',
	description: 'Displays the leaderboard',
	aliases: ['lb', 'leaderb', 'lboard'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');
		const fetch = require('node-fetch');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);

		const timedOut = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setDescription(`This menu has timed out. Please use the command again.`)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const guild = await hypixel.getGuild('player', 'GamerCoder215');
		function comma(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		let leaderboard = [];
		if (!args[0]) {
		const notify = await message.channel.send(`Calculating Leaderboard...`);
		let i = 0;

		function getRank(rank) {
			if (rank.includes('Default')) {
				return (``);
			} else return (`[${rank}] `);
		}
		while (i < guild.members.length) {
			let guildMP = guild.members[i].weeklyExperience;
			
			let guildMU = await hypixel.getPlayer(guild.members[i].uuid);

			leaderboard.push({
				points: guildMP,
				user: {
					name: guildMU.nickname,
					level: guildMU.level,
					rank: getRank(guildMU.rank)
				}
			});
			i++;
		}
		leaderboard.sort(function(a, b){return b.points-a.points});

		const leaderboardEmbed = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Total GEXP: \`${comma(guild.experience)}\`\nGuild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\nLeaderbords based off of __Weekly Progress__ • Resets Monday at 5 am (UTC)\n\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - Level ${leaderboard[0].user.level} — ${comma(leaderboard[0].points)} GEXP\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - Level ${leaderboard[1].user.level} — ${comma(leaderboard[1].points)} GEXP\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - Level ${leaderboard[2].user.level} — ${comma(leaderboard[2].points)} GEXP\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - Level ${leaderboard[3].user.level} — ${comma(leaderboard[3].points)} GEXP\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - Level ${leaderboard[4].user.level} — ${comma(leaderboard[4].points)} GEXP\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - Level ${leaderboard[5].user.level} — ${comma(leaderboard[5].points)} GEXP\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - Level ${leaderboard[6].user.level} — ${comma(leaderboard[6].points)} GEXP\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - Level ${leaderboard[7].user.level} — ${comma(leaderboard[7].points)} GEXP\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - Level ${leaderboard[8].user.level} — ${comma(leaderboard[8].points)} GEXP\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - Level ${leaderboard[9].user.level} — ${comma(leaderboard[9].points)} GEXP\n\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const leaderboardEmbed2 = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Total GEXP: \`${comma(guild.experience)}\`\nGuild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\nLeaderbords based off of __Weekly Progress__ • Resets Monday at 5 am (UTC)\n\`\`\`fix\n11. ${leaderboard[10].user.rank}${leaderboard[10].user.name} - Level ${leaderboard[10].user.level} — ${comma(leaderboard[10].points)} GEXP\n12. ${leaderboard[11].user.rank}${leaderboard[11].user.name} - Level ${leaderboard[11].user.level} — ${comma(leaderboard[11].points)} GEXP\n13. ${leaderboard[12].user.rank}${leaderboard[12].user.name} - Level ${leaderboard[12].user.level} — ${comma(leaderboard[12].points)} GEXP\n14. ${leaderboard[13].user.rank}${leaderboard[13].user.name} - Level ${leaderboard[13].user.level} — ${comma(leaderboard[13].points)} GEXP\n15. ${leaderboard[14].user.rank}${leaderboard[14].user.name} - Level ${leaderboard[14].user.level} — ${comma(leaderboard[14].points)} GEXP\n16. ${leaderboard[15].user.rank}${leaderboard[15].user.name} - Level ${leaderboard[15].user.level} — ${comma(leaderboard[15].points)} GEXP\n17. ${leaderboard[16].user.rank}${leaderboard[16].user.name} - Level ${leaderboard[16].user.level} — ${comma(leaderboard[16].points)} GEXP\n18. ${leaderboard[17].user.rank}${leaderboard[17].user.name} - Level ${leaderboard[17].user.level} — ${comma(leaderboard[17].points)} GEXP\n19. ${leaderboard[18].user.rank}${leaderboard[18].user.name} - Level ${leaderboard[18].user.level} — ${comma(leaderboard[18].points)} GEXP\n20. ${leaderboard[19].user.rank}${leaderboard[19].user.name} - Level ${leaderboard[19].user.level} — ${comma(leaderboard[19].points)} GEXP\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();
		notify.delete();
		const leaderboardm = await message.channel.send({ embeds: [leaderboardEmbed]});
		leaderboardm.react('1️⃣').then(() => leaderboardm.react('2️⃣'))

		const leaderboardmfilter = (reaction, user) => {
			return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		const leaderboardmcollector = leaderboardm.createReactionCollector(leaderboardmfilter, { time: 120000 })
		leaderboardmcollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '1️⃣') {
				leaderboardm.edit(leaderboardEmbed);
				leaderboardm.reactions.resolve('1️⃣').users.remove(message.author.id);
			} else if (reaction.emoji.name === '2️⃣') {
				leaderboardm.edit(leaderboardEmbed2);
				leaderboardm.reactions.resolve('2️⃣').users.remove(message.author.id);
			}
		})
		leaderboardmcollector.on('end', (reaction, user) => {
			leaderboardm.edit({embeds: [timedOut]});
			leaderboardm.reactions.removeAll();
		})
		
	} else if (args[0].toLowerCase() === 'quest') {
		const notify = await message.channel.send(`Calculating Leaderboard...`);
		let leaderboard = [];
		let i = 0;

		function getRank(rank) {
			if (rank.includes('Default')) {
				return (``);
			} else return (`[${rank}] `);
		}
		while (i < guild.members.length) {
			let guildMQ = guild.members[i].questParticipation;
			let guildMU = await hypixel.getPlayer(guild.members[i].uuid);
			leaderboard.push({
				questPoints: guildMQ,
				user: {
					name: guildMU.nickname,
					level: guildMU.level,
					rank: getRank(guildMU.rank)
				}
			});
			i++;
		}

		leaderboard.sort(function(a, b){return b.questPoints-a.questPoints});

		const questLeaderboardEmbed = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Guild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\n__Quest Leaderboards__ (Resets after each Quest)\nQuest Points can be earned by completing **challenges** in any game.\n\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - Level ${leaderboard[0].user.level} — ${comma(leaderboard[0].questPoints)} Quest Points\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - Level ${leaderboard[1].user.level} — ${comma(leaderboard[1].questPoints)} Quest Points\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - Level ${leaderboard[2].user.level} — ${comma(leaderboard[2].questPoints)} Quest Points\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - Level ${leaderboard[3].user.level} — ${comma(leaderboard[3].questPoints)} Quest Points\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - Level ${leaderboard[4].user.level} — ${comma(leaderboard[4].questPoints)} Quest Points\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - Level ${leaderboard[5].user.level} — ${comma(leaderboard[5].questPoints)} Quest Points\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - Level ${leaderboard[6].user.level} — ${comma(leaderboard[6].questPoints)} Quest Points\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - Level ${leaderboard[7].user.level} — ${comma(leaderboard[7].questPoints)} Quest Points\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - Level ${leaderboard[8].user.level} — ${comma(leaderboard[8].questPoints)} Quest Points\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - Level ${leaderboard[9].user.level} — ${comma(leaderboard[9].questPoints)} Quest Points\n\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const questLeaderboardEmbed2 = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Guild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\n__Quest Leaderboards__ (Resets after each Quest)\nQuest Points can be earned by completing **challenges** in any game.\n\`\`\`fix\n11. ${leaderboard[10].user.rank}${leaderboard[10].user.name} - Level ${leaderboard[10].user.level} — ${comma(leaderboard[10].questPoints)} Quest Points\n12. ${leaderboard[11].user.rank}${leaderboard[11].user.name} - Level ${leaderboard[11].user.level} — ${comma(leaderboard[11].questPoints)} Quest Points\n13. ${leaderboard[12].user.rank}${leaderboard[12].user.name} - Level ${leaderboard[12].user.level} — ${comma(leaderboard[12].questPoints)} Quest Points\n14. ${leaderboard[13].user.rank}${leaderboard[13].user.name} - Level ${leaderboard[13].user.level} — ${comma(leaderboard[13].questPoints)} Quest Points\n15. ${leaderboard[14].user.rank}${leaderboard[14].user.name} - Level ${leaderboard[14].user.level} — ${comma(leaderboard[14].questPoints)} Quest Points\n16. ${leaderboard[15].user.rank}${leaderboard[15].user.name} - Level ${leaderboard[15].user.level} — ${comma(leaderboard[15].questPoints)} Quest Points\n17. ${leaderboard[16].user.rank}${leaderboard[16].user.name} - Level ${leaderboard[16].user.level} — ${comma(leaderboard[16].questPoints)} Quest Points\n18. ${leaderboard[17].user.rank}${leaderboard[17].user.name} - Level ${leaderboard[17].user.level} — ${comma(leaderboard[17].questPoints)} Quest Points\n19. ${leaderboard[18].user.rank}${leaderboard[18].user.name} - Level ${leaderboard[18].user.level} — ${comma(leaderboard[18].questPoints)} Quest Points\n20. ${leaderboard[19].user.rank}${leaderboard[19].user.name} - Level ${leaderboard[19].user.level} — ${comma(leaderboard[19].questPoints)} Quest Points\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		notify.delete();
		const leaderboardm = await message.channel.send({ embeds: [questLeaderboardEmbed]});
		leaderboardm.react('1️⃣').then(() => leaderboardm.react('2️⃣'));

		const leaderboardmfilter = (reaction, user) => {
			return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		const leaderboardmcollector = leaderboardm.createReactionCollector(leaderboardmfilter, { time: 120000 })
		leaderboardmcollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '1️⃣') {
				leaderboardm.edit(questLeaderboardEmbed);
				leaderboardm.reactions.resolve('1️⃣').users.remove(message.author.id);
			} else if (reaction.emoji.name === '2️⃣') {
				leaderboardm.edit(questLeaderboardEmbed2);
				leaderboardm.reactions.resolve('2️⃣').users.remove(message.author.id);
			}
		})
		leaderboardmcollector.on('end', (reaction, user) => {
			leaderboardm.edit({embeds: [timedOut]});
			leaderboardm.reactions.removeAll();
		})
	} else if (args[0].toLowerCase() === 'level' || args[0].toLowerCase() === 'levels') {
		const notify = await message.channel.send(`Calculating Leaderboard...`);
		let leaderboard = [];
		let i = 0;

		function getRank(rank) {
			if (rank.includes('Default')) {
				return (``);
			} else return (`[${rank}] `);
		}
		while (i < guild.members.length) {
			let guildMU = await hypixel.getPlayer(guild.members[i].uuid);
			leaderboard.push({
				level: guildMU.level,
				user: {
					name: guildMU.nickname,
					rank: getRank(guildMU.rank)
				}
			});
			i++;
		}

		leaderboard.sort(function(a, b){return b.level-a.level});

		const levelLeaderboardEmbed = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Guild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\n__Hypixel Level Leaderboards__\n\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - Level ${leaderboard[0].level}\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - Level ${leaderboard[1].level}\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - Level ${leaderboard[2].level}\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - Level ${leaderboard[3].level}\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - Level ${leaderboard[4].level}\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - Level ${leaderboard[5].level}\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - Level ${leaderboard[6].level}\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - Level ${leaderboard[7].level}\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - Level ${leaderboard[8].level}\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - Level ${leaderboard[9].level}\n\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		const levelLeaderboardEmbed2 = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`Guild Level: \`${guild.level}\`\nTotal Members: \`${guild.members.length}\`\n__Quest Leaderboards__ (Resets after each Quest)\nQuest Points can be earned by completing **challenges** in any game.\n\`\`\`fix\n11. ${leaderboard[10].user.rank}${leaderboard[10].user.name} - Level ${leaderboard[10].level}\n12. ${leaderboard[11].user.rank}${leaderboard[11].user.name} - Level ${leaderboard[11].level}\n13. ${leaderboard[12].user.rank}${leaderboard[12].user.name} - Level ${leaderboard[12].level}\n14. ${leaderboard[13].user.rank}${leaderboard[13].user.name} - Level ${leaderboard[13].level}\n15. ${leaderboard[14].user.rank}${leaderboard[14].user.name} - Level ${leaderboard[14].level}\n16. ${leaderboard[15].user.rank}${leaderboard[15].user.name} - Level ${leaderboard[15].level}\n17. ${leaderboard[16].user.rank}${leaderboard[16].user.name} - Level ${leaderboard[16].level}\n18. ${leaderboard[17].user.rank}${leaderboard[17].user.name} - Level ${leaderboard[17].level}\n19. ${leaderboard[18].user.rank}${leaderboard[18].user.name} - Level ${leaderboard[18].level}\n20. ${leaderboard[19].user.rank}${leaderboard[19].user.name} - Level ${leaderboard[19].level}\`\`\``)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		notify.delete();
		const leaderboardm = await message.channel.send({ embeds: [levelLeaderboardEmbed]});
		leaderboardm.react('1️⃣').then(() => leaderboardm.react('2️⃣'));

		const leaderboardmfilter = (reaction, user) => {
			return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		const leaderboardmcollector = leaderboardm.createReactionCollector(leaderboardmfilter, { time: 120000 })
		leaderboardmcollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '1️⃣') {
				leaderboardm.edit({ embeds: [levelLeaderboardEmbed]});
				leaderboardm.reactions.resolve('1️⃣').users.remove(message.author.id);
			} else if (reaction.emoji.name === '2️⃣') {
				leaderboardm.edit({ embeds: [levelLeaderboardEmbed2]});
				leaderboardm.reactions.resolve('2️⃣').users.remove(message.author.id);
			}
		})
		leaderboardmcollector.on('end', (reaction, user) => {
			leaderboardm.edit({ embeds: timedOut});
			leaderboardm.reactions.removeAll();
		})
	} else if (args[0].toLowerCase() === 'bedwars' || args[0] === 'bedwar') {
		const notify = await message.channel.send(`Calculating Leaderboard...`);
		let leaderboard = [];

		let i = 0;

		function getRank(rank) {
			if (rank.includes('Default')) {
				return (``);
			} else return (`[${rank}] `);
		}
		while (i < guild.members.length) {
			let guildMU = await hypixel.getPlayer(guild.members[i].uuid);
			let stats = guildMU.stats.bedwars;
			if (!stats) {
				i++;
			} else {
				leaderboard.push({
					bedwars: {
						coins: stats.coins,
						kills: stats.kills,
						level: stats.level,
						wins: stats.wins,
						kdr: stats.KDRatio,
						wlr: stats.WLRatio
					},
					user: {
						name: guildMU.nickname,
						rank: getRank(guildMU.rank),
						level: guildMU.level
					}
				});
				i++;
			}
		}

		function sortLeaderboard(type) {
			if (!type) return;
			if (type === 'coins') {
				leaderboard.sort(function(a, b){return b.bedwars.coins-a.bedwars.coins});
			} else if (type === 'kills') {
				leaderboard.sort(function(a, b){return b.bedwars.kills-a.bedwars.kills});
			} else if (type === 'level') {
				leaderboard.sort(function(a, b){return b.bedwars.level-a.bedwars.level});
			} else if (type === 'wins') {
				leaderboard.sort(function(a, b){return b.bedwars.wins-a.bedwars.wins});
			} else if (type === 'kdr') {
				leaderboard.sort(function(a, b){return b.bedwars.kdr-a.bedwars.kdr});
			} else if (type === 'wlr') {
				leaderboard.sort(function(a, b){return b.bedwars.wlr-a.bedwars.wlr});
			} else return;
		}
		const bedwarsLeaderboardEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(`__**TheNoobyGods Bedwars Leaderboard**__\nMembers: \`${guild.members.length}\`\n__Sorting Options__\n> 💰 - Coins\n> ⚔️ - Kills\n> ⬆️ - Bedwars Level\n> 👑 - Wins\n> ❎ - KDR (Kill Death Ratio)\n> ⚰️ - WLR (Win Lose Ratio)
		\n*Note: Leaderboards are in Top 10 to save memory*`)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		notify.delete();
		const bedwarsM = await message.channel.send({embeds: bedwarsLeaderboardEmbed});

		bedwarsM.react('💰').then(() => bedwarsM.react('⚔️')).then(() => bedwarsM.react('⬆️')).then(() => bedwarsM.react('👑')).then(() => bedwarsM.react('❎')).then(() => bedwarsM.react('⚰️'));

		const bedwarsFilter = (reaction, user) => {
			return ['💰', '⚔️', '⬆️', '👑', '❎', '⚰️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const bedwarsCollector = bedwarsM.createReactionCollector(bedwarsFilter, { time: 120000 })

		bedwarsCollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '💰') {
				sortLeaderboard('coins');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].bedwars.coins)} Coins\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].bedwars.coins)} Coins\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].bedwars.coins)} Coins\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].bedwars.coins)} Coins\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].bedwars.coins)} Coins\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].bedwars.coins)} Coins\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].bedwars.coins)} Coins\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].bedwars.coins)} Coins\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].bedwars.coins)} Coins\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].bedwars.coins)} Coins\n\`\`\``)
				bedwarsM.edit(bedwarsLeaderboardEmbed);
				bedwarsM.reactions.resolve('💰').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⚔️') {
				sortLeaderboard('kills');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].bedwars.kills)} Kills\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].bedwars.kills)} Kills\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].bedwars.kills)} Kills\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].bedwars.kills)} Kills\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].bedwars.kills)} Kills\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].bedwars.kills)} Kills\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].bedwars.kills)} Kills\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].bedwars.kills)} Kills\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].bedwars.kills)} Kills\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].bedwars.kills)} Kills\n\`\`\``)
				bedwarsM.edit(bedwarsLeaderboardEmbed);
				bedwarsM.reactions.resolve('⚔️').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⬆️') {
				sortLeaderboard('level');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - Level ${comma(leaderboard[0].bedwars.level)}\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - Level ${comma(leaderboard[1].bedwars.level)}\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - Level ${comma(leaderboard[2].bedwars.level)}\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - Level ${comma(leaderboard[3].bedwars.level)}\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - Level ${comma(leaderboard[4].bedwars.level)}\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - Level ${comma(leaderboard[5].bedwars.level)}\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - Level ${comma(leaderboard[6].bedwars.level)}\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - Level ${comma(leaderboard[7].bedwars.level)}\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - Level ${comma(leaderboard[8].bedwars.level)}\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - Level ${comma(leaderboard[9].bedwars.level)}\n\`\`\``)
				bedwarsM.edit(bedwarsLeaderboardEmbed);
				bedwarsM.reactions.resolve('⬆️').users.remove(message.author.id);
			} else if (reaction.emoji.name === '👑') {
				sortLeaderboard('wins');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].bedwars.wins)} Wins\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].bedwars.wins)} Wins\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].bedwars.wins)} Wins\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].bedwars.wins)} Wins\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].bedwars.wins)} Wins\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].bedwars.wins)} Wins\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].bedwars.wins)} Wins\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].bedwars.wins)} Wins\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].bedwars.wins)} Wins\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].bedwars.wins)} Wins\n\`\`\``)
				bedwarsM.edit(bedwarsLeaderboardEmbed);
				bedwarsM.reactions.resolve('👑').users.remove(message.author.id);
			} else if (reaction.emoji.name === '❎') {
				sortLeaderboard('kdr');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${leaderboard[0].bedwars.kdr} KDR\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${leaderboard[1].bedwars.kdr} KDR\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${leaderboard[2].bedwars.kdr} KDR\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${leaderboard[3].bedwars.kdr} KDR\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${leaderboard[4].bedwars.kdr} KDR\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${leaderboard[5].bedwars.kdr} KDR\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${leaderboard[6].bedwars.kdr} KDR\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${leaderboard[7].bedwars.kdr} KDR\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${leaderboard[8].bedwars.kdr} KDR\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${leaderboard[9].bedwars.kdr} KDR\n\`\`\``)
				bedwarsM.edit(bedwarsLeaderboardEmbed);
				bedwarsM.reactions.resolve('❎').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⚰️') {
				sortLeaderboard('wlr');
				bedwarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${leaderboard[0].bedwars.wlr} WLR\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${leaderboard[1].bedwars.wlr} WLR\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${leaderboard[2].bedwars.wlr} WLR\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${leaderboard[3].bedwars.wlr} WLR\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${leaderboard[4].bedwars.wlr} WLR\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${leaderboard[5].bedwars.wlr} WLR\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${leaderboard[6].bedwars.wlr} WLR\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${leaderboard[7].bedwars.wlr} WLR\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${leaderboard[8].bedwars.wlr} WLR\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${leaderboard[9].bedwars.wlr} WLR\n\`\`\``)
				bedwarsM.edit({ embeds: [bedwarsLeaderboardEmbed]});
				bedwarsM.reactions.resolve('⚰️').users.remove(message.author.id);
			}
		})
		bedwarsCollector.on('end', (collected) => {
			bedwarsM.reactions.removeAll()
			bedwarsM.edit({embeds: [timedOut]});
		})
	} else if (args[0].toLowerCase() === 'skywars' || args[0].toLowerCase() === 'skywar') {
		const notify = await message.channel.send(`Calculating Leaderboard...`);
		let leaderboard = [];

		let i = 0;

		function getRank(rank) {
			if (rank.includes('Default')) {
				return (``);
			} else return (`[${rank}] `);
		}
		while (i < guild.members.length) {
			let guildMU = await hypixel.getPlayer(guild.members[i].uuid);
			let stats = guildMU.stats.skywars;
			if (!stats) {
				i++;
			} else {
				leaderboard.push({
					skywars: {
						coins: stats.coins,
						kills: stats.kills,
						level: stats.level,
						wins: stats.wins,
						kdr: stats.KDRatio,
						wlr: stats.WLRatio
					},
					user: {
						name: guildMU.nickname,
						rank: getRank(guildMU.rank),
						level: guildMU.level
					}
				});
				i++;
			}
		}

		function sortLeaderboard(type) {
			if (!type) return;
			if (type === 'coins') {
				leaderboard.sort(function(a, b){return b.skywars.coins-a.skywars.coins});
			} else if (type === 'kills') {
				leaderboard.sort(function(a, b){return b.skywars.kills-a.skywars.kills});
			} else if (type === 'level') {
				leaderboard.sort(function(a, b){return b.skywars.level-a.skywars.level});
			} else if (type === 'wins') {
				leaderboard.sort(function(a, b){return b.skywars.wins-a.skywars.wins});
			} else if (type === 'kdr') {
				leaderboard.sort(function(a, b){return b.skywars.kdr-a.skywars.kdr});
			} else if (type === 'wlr') {
				leaderboard.sort(function(a, b){return b.skywars.wlr-a.skywars.wlr});
			} else return;
		}
		const skywarsLeaderboardEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(`__**TheNoobyGods Skywars Leaderboard**__\nMembers: \`${guild.members.length}\`\n__Sorting Options__\n> 💰 - Coins\n> ⚔️ - Kills\n> ⬆️ - Skywars Level\n> 👑 - Wins\n> ❎ - KDR (Kill Death Ratio)\n> ⚰️ - WLR (Win Lose Ratio)
		\n*Note: Leaderboards are in Top 10 to save memory*`)
		.setFooter(config.name, config.icon)
		.setTimestamp();

		notify.delete();
		const skywarsM = await message.channel.send({ embeds: [skywarsLeaderboardEmbed]});

		skywarsM.react('💰').then(() => skywarsM.react('⚔️')).then(() => skywarsM.react('⬆️')).then(() => skywarsM.react('👑')).then(() => skywarsM.react('❎')).then(() => skywarsM.react('⚰️'));

		const skywarsFilter = (reaction, user) => {
			return ['💰', '⚔️', '⬆️', '👑', '❎', '⚰️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const skywarsCollector = skywarsM.createReactionCollector(skywarsFilter, { time: 120000 })

		skywarsCollector.on('collect', (reaction, user) => {
			if (reaction.emoji.name === '💰') {
				sortLeaderboard('coins');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].skywars.coins)} Coins\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].skywars.coins)} Coins\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].skywars.coins)} Coins\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].skywars.coins)} Coins\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].skywars.coins)} Coins\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].skywars.coins)} Coins\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].skywars.coins)} Coins\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].skywars.coins)} Coins\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].skywars.coins)} Coins\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].skywars.coins)} Coins\n\`\`\``)
				skywarsM.edit(skywarsLeaderboardEmbed);
				skywarsM.reactions.resolve('💰').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⚔️') {
				sortLeaderboard('kills');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].skywars.kills)} Kills\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].skywars.kills)} Kills\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].skywars.kills)} Kills\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].skywars.kills)} Kills\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].skywars.kills)} Kills\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].skywars.kills)} Kills\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].skywars.kills)} Kills\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].skywars.kills)} Kills\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].skywars.kills)} Kills\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].skywars.kills)} Kills\n\`\`\``)
				skywarsM.edit(skywarsLeaderboardEmbed);
				skywarsM.reactions.resolve('⚔️').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⬆️') {
				sortLeaderboard('level');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - Level ${comma(leaderboard[0].skywars.level)}\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - Level ${comma(leaderboard[1].skywars.level)}\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - Level ${comma(leaderboard[2].skywars.level)}\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - Level ${comma(leaderboard[3].skywars.level)}\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - Level ${comma(leaderboard[4].skywars.level)}\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - Level ${comma(leaderboard[5].skywars.level)}\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - Level ${comma(leaderboard[6].skywars.level)}\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - Level ${comma(leaderboard[7].skywars.level)}\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - Level ${comma(leaderboard[8].skywars.level)}\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - Level ${comma(leaderboard[9].skywars.level)}\n\`\`\``)
				skywarsM.edit(skywarsLeaderboardEmbed);
				skywarsM.reactions.resolve('⬆️').users.remove(message.author.id);
			} else if (reaction.emoji.name === '👑') {
				sortLeaderboard('wins');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${comma(leaderboard[0].skywars.wins)} Wins\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${comma(leaderboard[1].skywars.wins)} Wins\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${comma(leaderboard[2].skywars.wins)} Wins\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${comma(leaderboard[3].skywars.wins)} Wins\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${comma(leaderboard[4].skywars.wins)} Wins\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${comma(leaderboard[5].skywars.wins)} Wins\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${comma(leaderboard[6].skywars.wins)} Wins\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${comma(leaderboard[7].skywars.wins)} Wins\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${comma(leaderboard[8].skywars.wins)} Wins\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${comma(leaderboard[9].skywars.wins)} Wins\n\`\`\``)
				skywarsM.edit(skywarsLeaderboardEmbed);
				skywarsM.reactions.resolve('👑').users.remove(message.author.id);
			} else if (reaction.emoji.name === '❎') {
				sortLeaderboard('kdr');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${leaderboard[0].skywars.kdr} KDR\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${leaderboard[1].skywars.kdr} KDR\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${leaderboard[2].skywars.kdr} KDR\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${leaderboard[3].skywars.kdr} KDR\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${leaderboard[4].skywars.kdr} KDR\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${leaderboard[5].skywars.kdr} KDR\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${leaderboard[6].skywars.kdr} KDR\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${leaderboard[7].skywars.kdr} KDR\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${leaderboard[8].skywars.kdr} KDR\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${leaderboard[9].skywars.kdr} KDR\n\`\`\``)
				skywarsM.edit(skywarsLeaderboardEmbed);
				skywarsM.reactions.resolve('❎').users.remove(message.author.id);
			} else if (reaction.emoji.name === '⚰️') {
				sortLeaderboard('wlr');
				skywarsLeaderboardEmbed.setDescription(`\`\`\`fix\n1. ${leaderboard[0].user.rank}${leaderboard[0].user.name} - ${leaderboard[0].skywars.wlr} WLR\n2. ${leaderboard[1].user.rank}${leaderboard[1].user.name} - ${leaderboard[1].skywars.wlr} WLR\n3. ${leaderboard[2].user.rank}${leaderboard[2].user.name} - ${leaderboard[2].skywars.wlr} WLR\n4. ${leaderboard[3].user.rank}${leaderboard[3].user.name} - ${leaderboard[3].skywars.wlr} WLR\n5. ${leaderboard[4].user.rank}${leaderboard[4].user.name} - ${leaderboard[4].skywars.wlr} WLR\n6. ${leaderboard[5].user.rank}${leaderboard[5].user.name} - ${leaderboard[5].skywars.wlr} WLR\n7. ${leaderboard[6].user.rank}${leaderboard[6].user.name} - ${leaderboard[6].skywars.wlr} WLR\n8. ${leaderboard[7].user.rank}${leaderboard[7].user.name} - ${leaderboard[7].skywars.wlr} WLR\n9. ${leaderboard[8].user.rank}${leaderboard[8].user.name} - ${leaderboard[8].skywars.wlr} WLR\n10. ${leaderboard[9].user.rank}${leaderboard[9].user.name} - ${leaderboard[9].skywars.wlr} WLR\n\`\`\``)
				skywarsM.edit({ embeds: [skywarsLeaderboardEmbed]});
				skywarsM.reactions.resolve('⚰️').users.remove(message.author.id);
			}
		})
		skywarsCollector.on('end', (collected) => {
			skywarsM.reactions.removeAll()
			skywarsM.edit({embeds: [timedOut]});
		})
	} else return message.channel.send('Please provide a valid leaderboard type. Valid types include:\n\`\`\`\nGEXP (/leaderboard)\nQuest (/leaderboard quest)\nLevels (/leaderboard level)\nBedwars (/leaderboard bedwars)\nSkywars (/leaderboard skywars)\`\`\`');

	leaderboard = [];
	}
}