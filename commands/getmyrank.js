module.exports = {
	name: 'getrank',
	description: 'Calculates your rank.',
	aliases: ['myrank', 'getmyrank'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');
		const nbt = require('prismarine-nbt');
		const fetch = require('node-fetch');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);

		function sum( obj ) {
			var sum = 0;
			for( var el in obj ) {
				if( obj.hasOwnProperty( el ) ) {
					sum += parseFloat( obj[el] );
				}
			}
			return sum;
		}


		function removeChatColor(str) {
			let newStr = str.replace(/§1/g, '').replace(/§2/g, '').replace(/§3/g, '').replace(/§4/g, '').replace(/§5/g, '').replace(/§6/g, '').replace(/§7/g, '').replace(/§8/g, '').replace(/§9/g, '').replace(/§0/g, '').replace(/§a/g, '').replace(/§b/g, '').replace(/§c/g, '').replace(/§d/g, '').replace(/§e/g, '').replace(/§f/g, '');

			return newStr;
		}
			let ranks = [
				{ rank: 'Beginner', req: 601 },
				{ rank: 'Experienced', req: 1101 },
				{ rank: 'Pro', req: 1801 },
				{ rank: 'Demi-Gods', req: null }
			]
			function giveBackRank() {
			// Giving back rank
			let finalscore = sbscore + score;
			let rank = 'Unknown';
			let usedsb = ' not ';
			if (sbused === true) usedsb = ' ';
			if (finalscore < 1000 && finalscore > 0) rank = ranks[0];
			if (finalscore > 1000 && finalscore < 2100) {
				rank = ranks[1];
			}
			if (finalscore > 2100 && finalscore < 4000) {
				rank = ranks[2];
			}
			if (finalscore > 4000) {
				rank = ranks[3];
			}

			const rankedEmbed = new Discord.MessageEmbed()
			.setColor(config.emerald)
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setDescription(`You have${usedsb}used skyblock stats.\n\nYour final score was \`${finalscore}\`.\n\nYour calculated rank is **${rank.rank}**!`)
			.setFooter(config.name, config.icon)
			.setTimestamp();
			
			if (sbused === false) rankedEmbed.addField(`You have not supplied Skyblock Stats. If you want to add skyblock stats to your calculation, include a profile name after the player name.`, 'Examples: \n\`/getrank GamerCoder215 Pear\`\n\`/getrank GamerCoder215 Mango\`');
			message.channel.send({ embeds: [rankedEmbed]});
			}
			let sbscore = 0;
			let score = 0;
			let sbused = false;
			let sbready = true;
			if (!args[0]) return message.channel.send('Please provide a user!');
			// Calculating Rank
			message.channel.send('Calculating Rank...');
			await hypixel.getPlayer(args[0])
			.then(async player => {
			fetch(`https://api.hypixel.net/player?uuid=${player.uuid}&key=${process.env.HYPIXEL_TOKEN}`)
			.then(res => res.json())
			.then(async data => {
			if (!player) return message.channel.send(`It looks like this player does not exist. Please remember that names are case sensitive.`);

			const stats = player.stats;

			// Other Categories
			let achievementScore = Math.floor(player.achievementPoints / 50);
			score += achievementScore;

			let levelScore = Math.floor(player.level);
			score += levelScore;
			const scoreEmbed = new Discord.MessageEmbed()
			.setColor(config.emerald)
			.setDescription(`__General Stats__\nYou scored **${achievementScore}** in achievements\nYou scored **${levelScore}** in Hypixel Leveling.\n**+1 Per 15,00 Karma**\n\n__Game Stats__`)
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setFooter(config.name, config.icon)
			.setTimestamp();
			// Normal Stats
			if (stats.bedwars !== null) {
				let bwscore = Math.floor(stats.bedwars.kills / 100) + stats.bedwars.finalKills + stats.bedwars.level + stats.bedwars.wins;

				score += bwscore;
				scoreEmbed.addField(`You scored **${bwscore}** in Bedwars.`, 'This is your score in Bedwars.');
			}
			if (stats.skywars !== null) {
				let level = stats.skywars.level;
				if (isNaN(level)) level = 1;
				let swscore = (level * 3) + stats.skywars.wins + Math.floor(stats.skywars.kills / 100)
				score += swscore;
				scoreEmbed.addField(`You scored **${swscore}** in Skywars.`, 'This is your score in Skywars.');
			}
			if (stats.duels !== null) {
				let dscore = Math.floor(stats.duels.kills / 100) + stats.duels.wins

				score += dscore;
				scoreEmbed.addField(`You scored **${dscore}** in Duels.`, 'This is your score in Duels.');
			}
			if (stats.tntgames !== null) {
				let tntscore = stats.tntgames.wins + Math.floor(stats.tntgames.pvprun.kills / 100)

				score += tntscore;
				scoreEmbed.addField(`You scored **${tntscore}** in TNT Games.`, `This is your score in TNT Games.`);
			}
			if (stats.buildbattle !== null) {
				let buildscore = stats.buildbattle.totalWins + Math.floor(stats.buildbattle.totalVotes / 10)

				score += buildscore;
				scoreEmbed.addField(`You scored **${buildscore}** in Build Battle.`, `This is your score in Build Battle.`);
			}
			if (stats.murdermystery !== null) {
				let murderscore = stats.murdermystery.wins + Math.floor(stats.murdermystery.kills / 100) + Math.floor(stats.murdermystery.playedGames / 5)

				score += murderscore;
				scoreEmbed.addField(`You scored **${murderscore}** in Murder Mystery.`, `This is your score in Murder Mystery.`);
			}
			if(stats.uhc !== null) {
				let uhcscore = stats.uhc.wins + Math.floor(stats.uhc.kills / 100) + Math.floor(stats.uhc.starLevel * 2);
				
				score += uhcscore;
				scoreEmbed.addField(`You scored **${uhcscore}** in UHC.`, `This is your score in UHC (Ultra Hardcore)`);
			}
			let fetchStats = data.player.stats;
			if (fetchStats["Arcade"] !== null) {
				let arcadestats = fetchStats["Arcade"];
				let arcadescore = Math.floor(arcadestats.coins / 5000);

				score += arcadescore;
				scoreEmbed.addField(`You scored **${arcadescore}** in Arcade.`, `This is your score in Arcade.`);
			}
			scoreEmbed.addField(`Your Hypixel Score **${score}**`, 'This is your score for all of the other games.');

			score += Math.floor(player.karma / 15000);

			message.channel.send({ embeds: [scoreEmbed]});

			const profM = args[1] ? await hypixel.getSkyblockMember(args[0]) : null;

			if (profM !== null && args[1]) {
				sbready = false;
				sbused = true;
				let profs = [];
				const profiles = await hypixel.getSkyblockProfiles(args[0]);
				let i = 0;
				while (i < profiles.length) {
					profs.push(profiles[i].profileName);
					i++;
				}
				let argsOneCapitalized = args[1].toLowerCase().charAt(0).toUpperCase() + args[1].slice(1);
				if (!profs.includes(argsOneCapitalized)) return message.channel.send('The profile you have given does not exist for this player. Please note that profiles are case sensitive.');
				const member = profM.get(argsOneCapitalized);

				let skillscore = 0;
				if (member.skills !== null) {
					skillscore += Math.floor((member.skills.farming.level + member.skills.mining.level + member.skills.combat.level + member.skills.fishing.level + member.skills.foraging.level + member.skills.enchanting.level + member.skills.alchemy.level) * 2)
				}
				if (member.dungeons !== null) {
					skillscore += member.dungeons.types.catacombs.level;
				}
				sbscore += skillscore;
			
				let slayerscore = Math.floor((member.slayer.zombie.level + member.slayer.wolf.level + member.slayer.spider.level) * 5);

				sbscore += slayerscore;

				let dungeonscore = Math.floor((member.dungeons.classes.mage.level + member.dungeons.classes.healer.level + member.dungeons.classes.tank.level + member.dungeons.classes.berserk.level + member.dungeons.classes.archer.level) * 2);

				sbscore += dungeonscore;

				let fairyscore = Math.floor(member.fairySouls / 2);

				sbscore += fairyscore;

				// Fetching Stats
				fetch(`https://api.hypixel.net/skyblock/profiles?key=${process.env.HYPIXEL_TOKEN}&uuid=${player.uuid}`)
				.then(res => res.json())
				.then(async data => {
					let profs = data.profiles;
					let mainprof = null;
					function ifCorrect(item, index) {
						const caps = args[1].charAt(0).toUpperCase() + args[1].slice(1);
						if (item.cute_name == caps) {
							mainprof = item;
						} else return;
					}
					profs.forEach(ifCorrect);
					if (mainprof === null) return message.channel.send('There was an error fetching statisics. Contact \`GamerCoder215#2640\` if you think this is an issue.');
					let memberstats = mainprof.members[`${player.uuid}`];
					if (!memberstats) return message.channel.send('There was an error fetching statisics. Contact \`GamerCoder215#2640\` if you think this is an issue.');
					let jacobscore = 0;
					if (memberstats.jacob2) {
						function calculateJacobScore(item, index) {
							let position = item.claimed_position ? item.claimed_position : 1;
							let participants = item.claimed_participants ? item.claimed_participants : 100;

							let contestScore = 0;
							if (item.collected < 200) return;
							let topPercentage = Math.floor(position / participants) * 100;
							if (topPercentage > 25 && topPercentage < 60) contestScore += 1;
							else if (topPercentage > 5 && topPercentage < 25) contestScore += 2;
							else if (topPercentage < 5) contestScore += 4;

							jacobscore += contestScore;
						}
						Object.values(memberstats.jacob2.contests).forEach(calculateJacobScore);
						sbscore += jacobscore;
					}

					let minionscore = memberstats.crafted_generators ? Math.floor(memberstats.crafted_generators.length / 3) : 0;

					sbscore += minionscore;

					let collectionscore = memberstats.unlocked_coll_tiers ? Math.floor(memberstats.unlocked_coll_tiers.length / 3) : 0;

					sbscore += collectionscore;

					let petscore = 0;
					function calcPetScore(item, index) {
						let individualPetScore = 0;
						let rarity = item.tier.toLowerCase();
						if (rarity == 'common') {
							individualPetScore += 1;
						} else if (rarity == 'uncommon') {
							individualPetScore += 2;
						} else if (rarity == 'rare') {
							individualPetScore += 3;
						} else if (rarity == 'epic') {
							individualPetScore += 4;
						} else if (rarity == 'legendary') {
							individualPetScore += 5;
						} else if (rarity == 'mythic') {
							individualPetScore += 6;
						}
						let exp = item.exp;
						individualPetScore += Math.floor(exp / (1000000 * (item.candyUsed + 1)));

						individualPetScore += item.heldItem != null ? 5 : 0;

						individualPetScore += item.skin != null ? 10 : 0;

						petscore += individualPetScore;
					}

					memberstats.pets.forEach(calcPetScore);
					sbscore += petscore;

					let grindScore = Math.floor((memberstats.stats.kills - memberstats.stats.deaths) / 100)

					sbscore += grindScore;
					
					function sortCompletedQuests(item) {
						return (item.status.toLowerCase() == 'complete');
					}

					let questScore = memberstats.quests ? Math.floor(Object.values(memberstats.quests).filter(sortCompletedQuests).length / 3) : 0;

					sbscore += questScore;

					let explorerScore = memberstats.visited_zones ? Math.floor(memberstats.visited_zones.length / 3) : 0;

					sbscore += explorerScore;

					function sortCompletedObjective(item) {
						return (item.status.toLowerCase() == 'complete');
					}
					let objectiveScore = (memberstats.objectives ? Math.floor(Object.values(memberstats.objectives).filter(sortCompletedObjective).length / 3) : 0) + (memberstats.tutorial ? Math.floor(memberstats.tutorial.length / 3) : 0)

					sbscore += objectiveScore;

					let dianaScore = 0;
					if (memberstats.griffin) {
						dianaScore = memberstats.griffin.burrows.length * 3;
					}
					sbscore += dianaScore;

					function calculateRarityMultiplier(rarityString) {
						if (rarityString.includes("§f")) return 1;
						else if (rarityString.includes("§a")) return 1.05;
						else if (rarityString.includes("§9")) return 1.1;
						else if (rarityString.includes("§5")) return 1.15;
						else if (rarityString.includes("§6")) return 1.2;
						else if (rarityString.includes("§d")) return 1.25;
						else if (rarityString.includes("§4")) return 1.3;
						else if (rarityString.includes("§c") && !(rarityString.includes("§k"))) return 1.4;
						else if (rarityString.includes("§c") && rarityString.includes("§k")) return 1.55;
						else return 1;
					}

					// Calculate Wardrobe & Armor
					let armorScore = 0;

					if (memberstats.wardrobe_contents) {
						await nbt.parse(Buffer.from(memberstats.wardrobe_contents.data, "base64"), (err, wdata) => {
							wdata.value.i.value.value.forEach((piece) => {
								if (!(piece.tag)) return;
								let tag = piece.tag.value;

								if (tag["ExtraAttributes"]) {
									let attributes = tag["ExtraAttributes"].value;

									if (attributes.enchantments) {
										Object.values(attributes.enchantments.value).forEach((eobject) => {
											armorScore += eobject.value;
										});
									}
								}

								if (tag.display) {
									let name = tag.display.value["Name"].value;

									armorScore *= calculateRarityMultiplier(name);
									armorScore = Math.floor(armorScore);
								}

						
							
							});
						});
						sbscore += armorScore;
					}

					if (memberstats.inv_armor) {
						await nbt.parse(Buffer.from(memberstats.inv_armor.data, "base64"), (err, adata) => {
							adata.value.i.value.value.forEach((piece) => {
								if (!(piece.tag)) return;
								let tag = piece.tag.value;

								if (tag["ExtraAttributes"]) {
									let attributes = tag["ExtraAttributes"].value;

									if (attributes.enchantments) {
										Object.values(attributes.enchantments.value).forEach((eobject) => {
											armorScore += eobject.value;
										});
									}
								}

								if (tag.display) {
									let name = tag.display.value["Name"].value;

									armorScore *= calculateRarityMultiplier(name);
									armorScore = Math.floor(armorScore);
								}

						
							
							});
						})
						sbscore += armorScore;
					}
				
				// Calculate Talisman Bag
				let talismanScore = 0;

				if (memberstats.talisman_bag) {
					await nbt.parse(Buffer.from(memberstats.talisman_bag.data, "base64"), (err, tdata) => {
						tdata.value.i.value.value.forEach((talisman) => {
							if (!(talisman.tag)) return;
							let tag = talisman.tag.value;

							if(tag["ExtraAttributes"]) {
								let attributes = tag["ExtraAttributes"].value;

								if (attributes.id) {
									let id = attributes.id.value;

									if (id.includes("TALISMAN")) {
										talismanScore += 3;
									} else if (id.includes("RING")) {
										talismanScore += 4;
									} else if (id.includes("ARTIFACT")) {
										talismanScore += 5;
									}
								}

								if (attributes.modifier) {
									talismanScore += 3;
								}

								if (tag.display) {
									let name = tag.display.value["Name"].value;

									talismanScore *= calculateRarityMultiplier(name);
									talismanScore = Math.floor(talismanScore);
								}
							}

							
						})
					});
					sbscore += talismanScore;
				}
					
				const skyblockEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setDescription(`You scored **${armorScore}** in Armor.\nYou scored **${talismanScore}** in talismans.\nYou scored **${petscore}** in pets.\nYou scored **${skillscore}** in skills.\nYou scored **${slayerscore}** in slayers.\nYou scored **${dungeonscore}** in dungeons.\nYou scored **${collectionscore}** in collections (Number of tiers unlocked / 3).\nYou scored **${fairyscore}** in fairy souls (Total Amount / 2).\nYou scored **${jacobscore}** in Jacob Medals.\nYou scored **${grindScore}** in grinding.\n You scored **${questScore}** in quests and **${objectiveScore}** in objectives.\nYou scored **${explorerScore}** in exploring.\nYou scored **${minionscore}** in minion crafting.\n\nYour Skyblock Score is **${sbscore}** (*It is possible your stats are bugged so this can also be your final score*).`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				message.channel.send({ embeds: [skyblockEmbed]});
				sbready = true;
		})
		.then(() => {
		function check() {
			if (sbready == false) {
				setTimeout(() => {
					check();				
				}, 250);
			} else {
				giveBackRank();
			}
		}
		check();
		})
		} else {
			giveBackRank();
		}
		})
	})
	.catch(err => {
			console.error(err);
			return message.channel.send('This player does not exist, or does not have their API on. Please click here if you do not know how to turn your API on.\n<https://sky.lea.moe/resources/video/enable_api.webm>');
		})
	}
}