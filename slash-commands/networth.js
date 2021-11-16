const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("networth")
		.setDescription("Gets a Hypixel Skyblock Networth.")
		.addStringOption(option =>
			option.setName("username")
				.setRequired(true)
				.setDescription("The username of the user."))
		.addStringOption(option =>
			option.setName("mode")
				.setRequired(true)
				.setDescription("Your filter option for networth.")
				.addChoice("Bazaar Only (By Sell)", "bz_only_sell")
				.addChoice("Bazaar Only (By Buy)", "bz_only_buy")
				.addChoice("AH Only Lowest BIN", "ah_only_lowest_bin")
				.addChoice("AH Only Highest BIN", "ah_only_highest_bin")
				.addChoice("AH Only Lowest Auction", "ah_only_lowest_auction")
				.addChoice("AH Only Highest Auction", "ah_only_highest_auction")
				.addChoice("AH Only Lowest Price", "ah_only_lowest")
				.addChoice("AH Only Highest Price", "ah_only_highest")
				.addChoice("Both & AH Lowest BIN", "both_lowest_bin")
				.addChoice("Both & AH Highest BIN", "both_highest_bin")
				.addChoice("Both & AH Lowest Auction", "both_lowest_auction")
				.addChoice("Both & AH Highest Auction", "both_highest_auction")
				.addChoice("Both & AH Lowest Price", "both_lowest")
				.addChoice("Both & AH Highest Price", "both_highest"))
		.addStringOption(option =>
			option.setName("profile")
				.setRequired(false)
				.setDescription("The profile of the selected user. If none given, will default to the first profile."))
,
	async run(client, interaction) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const fetch = require('node-fetch');
		const nbt = require('prismarine-nbt');
		const Hypixel = require('hypixel-api-reborn');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);

		function removeChatColor(str) {
			let newStr = str.replace(/§1/g, '').replace(/§2/g, '').replace(/§3/g, '').replace(/§4/g, '').replace(/§5/g, '').replace(/§6/g, '').replace(/§7/g, '').replace(/§8/g, '').replace(/§9/g, '').replace(/§0/g, '').replace(/§a/g, '').replace(/§b/g, '').replace(/§c/g, '').replace(/§d/g, '').replace(/§e/g, '').replace(/§f/g, '').replace(/§l/g, '').replace(/§k/g, '').replace(/§n/g, '').replace(/§m/g, '').replace(/§o/g, '');

			return newStr;
		}

		function comma(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		try {
			fetch(`https://api.mojang.com/user/profile/agent/minecraft/name/${interaction.options.getString("username")}`)
			.then(res => res.json())
			.then(async mojangplayer => {
				if (!mojangplayer) {
					await interaction.reply("There was an error fetching that player. Make sure you spelled it correctly!");
					return;
				}

					fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${mojangplayer.id}&key=${process.env.HYPIXEL_TOKEN}`)
					.then(res => res.json())
					.then(async data => {
						if (!(data.success)) {
							await interaction.reply("There was an error fetching that player. Either they don't exist or have never played on Hypixel. Contact GamerCoder215 if this is an error.");
							return;
						}

						if (!(data.profiles[0])) {
							await interaction.reply("It seems this player does not have any skyblock profiles.");
							return;
						}

						let option = interaction.options.getString("mode");
						let profile = data.profiles[0].members[mojangplayer.id];
						let entireProf = data.profiles[0];
						let profileNumber = 1;

						function isCorrectProfile(item, index) {
							const caps = interaction.options.getString('profile').charAt(0).toUpperCase() + interaction.options.getString('profile').slice(1);

							if (item.cute_name == caps) {
								profile = item.members[mojangplayer.id];
								entireProf = item;
								profileNumber = index + 1;
							} else return;
						}

						if (interaction.options.getString("profile")) {
							data.profiles.forEach(isCorrectProfile());
						}

						const networthEmbed = new Discord.MessageEmbed()
						.setTitle(`${mojangplayer.name} | Profile #${profileNumber} (${entireProf.cute_name})`)
						.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
						.setThumbnail(`https://crafthead.net/cube/${mojangplayer.name}.png`)
						.setURL(`https://sky.shiiyu.moe/stats/${mojangplayer.name}/${entireProf.cute_name}`)
						.addFields(
							{ name: "👛 Purse", value: `${comma(Math.floor(profile.coin_purse * 100) / 100)} Coin(s)`, inline: true},
							{ name: "🏦 Bank", value: `${entireProf.banking ? comma(Math.floor(entireProf.banking.balance * 100) / 100) : "Private Banking"}`, inline: true},
						)
						.setColor(config.emerald)
						.setFooter(config.name, config.icon)
						.setTimestamp();

						const products = await hypixel.getSkyblockBazaar();
						if (option == "bz_only_sell") {
							let bzWorth = 0;
							function checkExistingProduct(name) {
								let i = 0;
								while (i < products.length) {
									if (products[i].productId === name.replace(/[ ]/g, '_').toUpperCase()) {
										return products[i];
									} else {
										i++;
									}
								}
								return false;
							}
							let inventoryWorth = 0;
							let invidivualWorthInventory = [];

							if (profile.inv_contents) {
								await nbt.parse(Buffer.from(profile.inv_contents.data, "base64"), (err, data) => {
									data.value.i.value.value.forEach((item, index) => {
										if (!(item)) return;
										if (!(item.tag)) return;
										let realName = removeChatColor(item.tag.value.display.value["Name"].value);

										let result = checkExistingProduct(realName);
										if (result == false) return;
										else {
											let value = Math.floor(result.status.sellPrice * 100) / 100;
											let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
											invidivualWorthInventory.push({
												name: realName,
												value: value,
												rarity: rarity,
												count: (item["Count"] ? item["Count"].value : 1),
											});

											bzWorth += value * (item["Count"] ? item["Count"].value : 1);
											inventoryWorth += value * (item["Count"] ? item["Count"].value : 1);
										}


									})
									

									if (invidivualWorthInventory.length > 1) {
										invidivualWorthInventory.sort((a, b) => { return b.value - a.value});
										let worth1 = (invidivualWorthInventory[0] ? `[${invidivualWorthInventory[0].rarity}] ${invidivualWorthInventory[0].name} x${invidivualWorthInventory[0].count.toString()} -> **${comma(invidivualWorthInventory[0].value * invidivualWorthInventory[0].count)}** coin(s)\n` : "None");
										let worth2 = (invidivualWorthInventory[1] ? `[${invidivualWorthInventory[1].rarity}] ${invidivualWorthInventory[1].name} x${invidivualWorthInventory[1].count.toString()} -> **${comma(invidivualWorthInventory[1].value * invidivualWorthInventory[1].count)}** coin(s)\n` : "");
										let worth3 = (invidivualWorthInventory[2] ? `[${invidivualWorthInventory[2].rarity}] ${invidivualWorthInventory[2].name} x${invidivualWorthInventory[2].count.toString()} -> **${comma(invidivualWorthInventory[2].value * invidivualWorthInventory[2].count)}** coin(s)\n` : "");
										let worth4 = (invidivualWorthInventory[3] ? `[${invidivualWorthInventory[3].rarity}] ${invidivualWorthInventory[3].name} x${invidivualWorthInventory[3].count.toString()} -> **${comma(invidivualWorthInventory[3].value * invidivualWorthInventory[3].count)}** coin(s)\n` : "");
										let worth5 = (invidivualWorthInventory[4] ? `[${invidivualWorthInventory[4].rarity}] ${invidivualWorthInventory[4].name} x${invidivualWorthInventory[4].count.toString()} -> **${comma(invidivualWorthInventory[4].value * invidivualWorthInventory[4].count)}** coin(s)\n` : "");

										networthEmbed.addField(`🗃️ Inventory Bazaar Value - ${comma(Math.floor(inventoryWorth * 100) / 100)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
									}
							});
						}


						let enderchestWorth = 0;
						let invidivualWorthEnderchest = [];
						if (profile.ender_chest_contents) {
							await nbt.parse(Buffer.from(profile.ender_chest_contents.data, "base64"), (err, data) => {
								data.value.i.value.value.forEach((item, index) => {
									if (!(item)) return;
									if (!(item.tag)) return;
									let realName = removeChatColor(item.tag.value.display.value["Name"].value);

									let result = checkExistingProduct(realName);
									if (result == false) return;
									else {
										let value = Math.floor(result.status.sellPrice * 100) / 100;
										let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
										invidivualWorthEnderchest.push({
											name: realName,
											value: value,
											rarity: rarity,
											count: (item["Count"] ? item["Count"].value : 1),
										});

										bzWorth += value * (item["Count"] ? item["Count"].value : 1);
										enderchestWorth += value * (item["Count"] ? item["Count"].value : 1);
									}
								})
								if (invidivualWorthEnderchest.length > 1) {
									invidivualWorthEnderchest.sort((a, b) => { return b.value - a.value});
									let worth1 = (invidivualWorthEnderchest[0] ? `[${invidivualWorthEnderchest[0].rarity}] ${invidivualWorthEnderchest[0].name} x${invidivualWorthEnderchest[0].count.toString()} -> **${comma(invidivualWorthEnderchest[0].value * invidivualWorthEnderchest[0].count)}** coin(s)\n` : "None");
									let worth2 = (invidivualWorthEnderchest[1] ? `[${invidivualWorthEnderchest[1].rarity}] ${invidivualWorthEnderchest[1].name} x${invidivualWorthEnderchest[1].count} -> **${comma(invidivualWorthEnderchest[1].value * invidivualWorthEnderchest[1].count)}** coin(s)\n` : "");
									let worth3 = (invidivualWorthEnderchest[2] ? `[${invidivualWorthEnderchest[2].rarity}] ${invidivualWorthEnderchest[2].name} x${invidivualWorthEnderchest[2].count.toString()} -> **${comma(invidivualWorthEnderchest[2].value * invidivualWorthEnderchest[2].count)}** coin(s)\n` : "");
									let worth4 = (invidivualWorthEnderchest[3] ? `[${invidivualWorthEnderchest[3].rarity}] ${invidivualWorthEnderchest[3].name} x${invidivualWorthEnderchest[3].count.toString()} -> **${comma(invidivualWorthEnderchest[3].value * invidivualWorthEnderchest[3].count)}** coin(s)\n` : "");
									let worth5 = (invidivualWorthEnderchest[4] ? `[${invidivualWorthEnderchest[4].rarity}] ${invidivualWorthEnderchest[4].name} x${invidivualWorthEnderchest[4].count.toString()} -> **${comma(invidivualWorthEnderchest[4].value * invidivualWorthEnderchest[4].count)}** coin(s)\n` : "");

									networthEmbed.addField(`🚚 Enderchest Bazaar Value - ${comma(Math.floor(enderchestWorth * 100) / 100)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
								}
							});
						}

						let backpackWorth = 0;
						let invidivualWorthBackpack = [];
						if (profile.backpack_contents) {
							for (const storageBackpack of Object.values(profile.backpack_contents)) {
								await nbt.parse(Buffer.from(storageBackpack.data, "base64"), (err, data) => {
									data.value.i.value.value.forEach((item, index) => {
										if (!(item)) return;
										if (!(item.tag)) return;
										let realName = removeChatColor(item.tag.value.display.value["Name"].value);

										let result = checkExistingProduct(realName);
										if (result == false) return;
										else {
											let value = Math.floor(result.status.sellPrice * 100) / 100;
											let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
											invidivualWorthBackpack.push({
												name: realName,
												value: value,
												rarity: rarity,
												count: (item["Count"] ? item["Count"].value : 1),
											});

											bzWorth += value * (item["Count"] ? item["Count"].value : 1);
											backpackWorth += value * (item["Count"] ? item["Count"].value : 1);
										}
									});
								});
							}
							

							if (invidivualWorthBackpack.length > 1) {
								invidivualWorthBackpack.sort((a, b) => {return b.value - a.value});
								let worth1 = (invidivualWorthBackpack[0] ? `[${invidivualWorthBackpack[0].rarity}] ${invidivualWorthBackpack[0].name} x${invidivualWorthBackpack[0].count.toString()} -> **${comma(invidivualWorthBackpack[0].value * invidivualWorthBackpack[0].count)}** coin(s)\n` : "None");
								let worth2 = (invidivualWorthBackpack[1] ? `[${invidivualWorthBackpack[1].rarity}] ${invidivualWorthBackpack[1].name} x${invidivualWorthBackpack[1].count.toString()} -> **${comma(invidivualWorthBackpack[1].value * invidivualWorthBackpack[1].count)}** coin(s)\n` : "");
								let worth3 = (invidivualWorthBackpack[2] ? `[${invidivualWorthBackpack[2].rarity}] ${invidivualWorthBackpack[2].name} x${invidivualWorthBackpack[2].count.toString()} -> **${comma(invidivualWorthBackpack[2].value * invidivualWorthBackpack[2].count)}** coin(s)\n` : "");
								let worth4 = (invidivualWorthBackpack[3] ? `[${invidivualWorthBackpack[3].rarity}] ${invidivualWorthBackpack[3].name} x${invidivualWorthBackpack[3].count.toString()} -> **${comma(invidivualWorthBackpack[3].value * invidivualWorthBackpack[3].count)}** coin(s)\n` : "");
								let worth5 = (invidivualWorthBackpack[4] ? `[${invidivualWorthBackpack[4].rarity}] ${invidivualWorthBackpack[4].name} x${invidivualWorthBackpack[4].count.toString()} -> **${comma(invidivualWorthBackpack[4].value * invidivualWorthBackpack[4].count)}** coin(s)\n` : "");

								networthEmbed.addField(`<:backpack:884335653268094997> Backpack Bazaar Value - ${comma(backpackWorth)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
							}
						}

						fetch(`https://api.hypixel.net/skyblock/bazaar?key=${process.env.HYPIXEL_TOKEN}`)
						.then(res => res.json())
						.then(async bzdata => {
							let cookiePrice = bzdata.products["BOOSTER_COOKIE"].quick_status.buyPrice;
							networthEmbed.setDescription(`${mojangplayer.name}'s Bazaar-Only-Items In-Game Networth is **${comma(Math.floor(bzWorth * 100) / 100)}** coin(s)\nBazaar-Only-Items IRL Networth is **${Math.floor((bzWorth / cookiePrice) * 100) / 100}\$**`);

							await interaction.reply({ embeds: [networthEmbed]});
						});
					} else if (option == "bz_only_buy") {
							let bzWorth = 0;
							function checkExistingProduct(name) {
								let i = 0;
								while (i < products.length) {
									if (products[i].productId === name.replace(/[ ]/g, '_').toUpperCase()) {
										return products[i];
									} else {
										i++;
									}
								}
								return false;
							}
							let inventoryWorth = 0;
							let invidivualWorthInventory = [];

							if (profile.inv_contents) {
								await nbt.parse(Buffer.from(profile.inv_contents.data, "base64"), (err, data) => {
									data.value.i.value.value.forEach((item, index) => {
										if (!(item)) return;
										if (!(item.tag)) return;
										let realName = removeChatColor(item.tag.value.display.value["Name"].value);

										let result = checkExistingProduct(realName);
										if (result == false) return;
										else {
											let value = Math.floor(result.status.buyPrice * 100) / 100;
											let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
											invidivualWorthInventory.push({
												name: realName,
												value: value,
												rarity: rarity,
												count:(item["Count"] ? item["Count"].value : 1), 
											});

											bzWorth += value * (item["Count"] ? item["Count"].value : 1);
											inventoryWorth += value * item["Count"].value;;
										}


									})

									if (invidivualWorthInventory.length > 1) {
										invidivualWorthInventory.sort((a, b) => { return b.value - a.value});
										
										let worth1 = (invidivualWorthInventory[0] ? `[${invidivualWorthInventory[0].rarity}] ${invidivualWorthInventory[0].name} x${invidivualWorthInventory[0].count.toString()} -> **${comma(invidivualWorthInventory[0].value * invidivualWorthInventory[0].count)}** coin(s)\n` : "None");
										let worth2 = (invidivualWorthInventory[1] ? `[${invidivualWorthInventory[1].rarity}] ${invidivualWorthInventory[1].name} x${invidivualWorthInventory[1].count.toString()} -> **${comma(invidivualWorthInventory[1].value * invidivualWorthInventory[1].count)}** coin(s)\n` : "");
										let worth3 = (invidivualWorthInventory[2] ? `[${invidivualWorthInventory[2].rarity}] ${invidivualWorthInventory[2].name} x${invidivualWorthInventory[2].count.toString()} -> **${comma(invidivualWorthInventory[2].value * invidivualWorthInventory[2].count)}** coin(s)\n` : "");
										let worth4 = (invidivualWorthInventory[3] ? `[${invidivualWorthInventory[3].rarity}] ${invidivualWorthInventory[3].name} x${invidivualWorthInventory[3].count.toString()} -> **${comma(invidivualWorthInventory[3].value * invidivualWorthInventory[3].count)}** coin(s)\n` : "");
										let worth5 = (invidivualWorthInventory[4] ? `[${invidivualWorthInventory[4].rarity}] ${invidivualWorthInventory[4].name} x${invidivualWorthInventory[4].count.toString()} -> **${comma(invidivualWorthInventory[4].value * invidivualWorthInventory[4].count)}** coin(s)\n` : "");

										networthEmbed.addField(`🗃️ Inventory Bazaar Value - ${comma(Math.floor(inventoryWorth * 100) / 100)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
									}
							});
						}


						let enderchestWorth = 0;
						let invidivualWorthEnderchest = [];
						if (profile.ender_chest_contents) {
							await nbt.parse(Buffer.from(profile.ender_chest_contents.data, "base64"), (err, data) => {
								data.value.i.value.value.forEach((item, index) => {
									if (!(item)) return;
									if (!(item.tag)) return;
									let realName = removeChatColor(item.tag.value.display.value["Name"].value);

									let result = checkExistingProduct(realName);
									if (result == false) return;
									else {
										let value = Math.floor(result.status.buyPrice * 100) / 100;
										let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
										invidivualWorthEnderchest.push({
											name: realName,
											value: value,
											rarity: rarity,
											count: (item["Count"] ? item["Count"].value : 1),
										});

										bzWorth += value * (item["Count"] ? item["Count"].value : 1);
										enderchestWorth += value * (item["Count"] ? item["Count"].value : 1);
									}
								})
								if (invidivualWorthEnderchest.length > 1) {
									invidivualWorthEnderchest.sort((a, b) => { return b.value - a.value});

									let worth1 = (invidivualWorthEnderchest[0] ? `[${invidivualWorthEnderchest[0].rarity}] ${invidivualWorthEnderchest[0].name} x${invidivualWorthEnderchest[0].count.toString()} -> **${comma(invidivualWorthEnderchest[0].value * invidivualWorthInventory[0].count)}** coin(s)\n` : "None");
									let worth2 = (invidivualWorthEnderchest[1] ? `[${invidivualWorthEnderchest[1].rarity}] ${invidivualWorthEnderchest[1].name} x${invidivualWorthEnderchest[1].count} -> **${comma(invidivualWorthEnderchest[1].value * invidivualWorthEnderchest[1].count)}** coin(s)\n` : "");
									let worth3 = (invidivualWorthEnderchest[2] ? `[${invidivualWorthEnderchest[2].rarity}] ${invidivualWorthEnderchest[2].name} x${invidivualWorthEnderchest[2].count.toString()} -> **${comma(invidivualWorthEnderchest[2].value * invidivualWorthEnderchest[2].count)}** coin(s)\n` : "");
									let worth4 = (invidivualWorthEnderchest[3] ? `[${invidivualWorthEnderchest[3].rarity}] ${invidivualWorthEnderchest[3].name} x${invidivualWorthEnderchest[3].count.toString()} -> **${comma(invidivualWorthEnderchest[3].value * invidivualWorthEnderchest[3].count)}** coin(s)\n` : "");
									let worth5 = (invidivualWorthEnderchest[4] ? `[${invidivualWorthEnderchest[4].rarity}] ${invidivualWorthEnderchest[4].name} x${invidivualWorthEnderchest[4].count.toString()} -> **${comma(invidivualWorthEnderchest[4].value * invidivualWorthEnderchest[4].count)}** coin(s)\n` : "");

									networthEmbed.addField(`🚚 Enderchest Bazaar Value - ${comma(Math.floor(enderchestWorth * 100) / 100)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
								}
							});
						}

						let backpackWorth = 0;
						let invidivualWorthBackpack = [];
						if (profile.backpack_contents) {
							for (const storageBackpack of Object.values(profile.backpack_contents)) {
								await nbt.parse(Buffer.from(storageBackpack.data, "base64"), (err, data) => {
									data.value.i.value.value.forEach((item, index) => {
										if (!(item)) return;
										if (!(item.tag)) return;
										let realName = removeChatColor(item.tag.value.display.value["Name"].value);

										let result = checkExistingProduct(realName);
										if (result == false) return;
										else {
											let value = Math.floor(result.status.buyPrice * 100) / 100;
											let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1]).split(' ')[0].substring(0, 3)
											invidivualWorthBackpack.push({
												name: realName,
												value: value,
												rarity: rarity,
												count: (item["Count"] ? item["Count"].value : 1),
											});

											bzWorth += value * (item["Count"]? item["Count"].value : 1);
											backpackWorth += value * (item["Count"] ? item["Count"].value : 1);
										}
									});
								});
							}

							if (invidivualWorthBackpack.length > 1) {
								invidivualWorthBackpack.sort((a, b) => {return b.value - a.value});

								let worth1 = (invidivualWorthBackpack[0] ? `[${invidivualWorthBackpack[0].rarity}] ${invidivualWorthBackpack[0].name} x${invidivualWorthBackpack[0].count.toString()} -> **${comma(invidivualWorthBackpack[0].value * invidivualWorthBackpack[0].count)}** coin(s)\n` : "None");
								let worth2 = (invidivualWorthBackpack[1] ? `[${invidivualWorthBackpack[1].rarity}] ${invidivualWorthBackpack[1].name} x${invidivualWorthBackpack[1].count.toString()} -> **${comma(invidivualWorthBackpack[1].value * invidivualWorthBackpack[1].count)}** coin(s)\n` : "");
								let worth3 = (invidivualWorthBackpack[2] ? `[${invidivualWorthBackpack[2].rarity}] ${invidivualWorthBackpack[2].name} x${invidivualWorthBackpack[2].count.toString()} -> **${comma(invidivualWorthBackpack[2].value * invidivualWorthBackpack[2].count)}** coin(s)\n` : "");
								let worth4 = (invidivualWorthBackpack[3] ? `[${invidivualWorthBackpack[3].rarity}] ${invidivualWorthBackpack[3].name} x${invidivualWorthBackpack[3].count.toString()} -> **${comma(invidivualWorthBackpack[3].value * invidivualWorthBackpack[3].count)}** coin(s)\n` : "");
								let worth5 = (invidivualWorthBackpack[4] ? `[${invidivualWorthBackpack[4].rarity}] ${invidivualWorthBackpack[4].name} x${invidivualWorthBackpack[4].count.toString()} -> **${comma(invidivualWorthBackpack[4].value * invidivualWorthBackpack[4].count)}** coin(s)\n` : "");

								networthEmbed.addField(`<:backpack:884335653268094997> Backpack Bazaar Value - ${comma(backpackWorth)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
							}
						}

						fetch(`https://api.hypixel.net/skyblock/bazaar?key=${process.env.HYPIXEL_TOKEN}`)
						.then(res => res.json())
						.then(async bzdata => {
							let cookiePrice = bzdata.products["BOOSTER_COOKIE"].quick_status.buyPrice;
							networthEmbed.setDescription(`${mojangplayer.name}'s Bazaar-Only-Items In-Game Networth is **${comma(Math.floor(bzWorth * 100) / 100)}** coin(s)\nBazaar-Only-Items IRL Networth is **${Math.floor((bzWorth / cookiePrice) * 100) / 100}\$**`);

							await interaction.reply({ embeds: [networthEmbed]});
						});
					} else if (option == 'ah_only_lowest_bin') {
						let ahWorth = 0;

						function getLowestBIN(item) {
							fetch(`https://api.hypixel.net/skyblock/auction?key=${process.env.HYPIXEL_TOKEN}`)
							.then(res => res.json())
							.then(async ahData => {
								if (!(item)) return;
								if (!(item.tag)) return;
								if (!(item.tag.value.display)) return;
								for (let i = 0; i < ahData.totalPages; i++) {
									fetch(`https://api.hypixel.net/skyblock/auction?key=${process.env.HYPIXEL_TOKEN}&page=${i}`)
									.then(res => res.json())
									.then(async ahPageData => {
										let auctions = ahPageData.auctions;

										auctions.filter((ahitem) => ahitem.bin == true);
										auctions.filter((ahitem) => ahitem.item_name == removeChatColor(item.tag.value.display.value["Name"].value));

										if (auctions.length > 0) {
											auctions.sort((a, b) => { let bidAmountA = (a.highest_bid_amount == 0 ? a.starting_bid : a.highest_bid_amount); let bidAmountB = (b.highest_bid_amount == 0 ? b.starting_bid : b.highest_bid_amount);
											return bidAmountA - bidAmountB});

											return auctions[0];
										}

									})
								}
							})
						} 
						
						let armorWorth = 0;
						let invidivualWorthArmor = [];

						if (profile.inv_armor) {
							await nbt.parse(Buffer.from(profile.inv_armor.data, "base64"), (err, data) => {
								data.value.i.value.value.forEach((item, index) => {
									let binItem = getLowestBIN(item);
									let realName = removeChatColor(binItem.item_name);

									invidivualWorthArmor.push({
										name: realName,
										rarity: binItem.tier.substring(0, 3),
										value: (binItem.highest_bid_amount == 0 ? binItem.starting_bid : binItem.highest_bid_amount)
									});

									armorWorth += (binItem.highest_bid_amount == 0 ? binItem.starting_bid : binItem.highest_bid_amount);
									ahWorth += (binItem.highest_bid_amount == 0 ? binItem.starting_bid : binItem.highest_bid_amount);
								});



									if (invidivualWorthInventory.length > 1) {
										invidivualWorthInventory.sort((a, b) => { return b.value - a.value});
										
										let worth1 = (invidivualWorthInventory[0] ? `[${invidivualWorthInventory[0].rarity}] ${invidivualWorthInventory[0].name} x${invidivualWorthInventory[0].count.toString()} -> **${comma(invidivualWorthInventory[0].value * invidivualWorthInventory[0].count)}** coin(s)\n` : "None");
										let worth2 = (invidivualWorthInventory[1] ? `[${invidivualWorthInventory[1].rarity}] ${invidivualWorthInventory[1].name} x${invidivualWorthInventory[1].count.toString()} -> **${comma(invidivualWorthInventory[1].value * invidivualWorthInventory[1].count)}** coin(s)\n` : "");
										let worth3 = (invidivualWorthInventory[2] ? `[${invidivualWorthInventory[2].rarity}] ${invidivualWorthInventory[2].name} x${invidivualWorthInventory[2].count.toString()} -> **${comma(invidivualWorthInventory[2].value * invidivualWorthInventory[2].count)}** coin(s)\n` : "");
										let worth4 = (invidivualWorthInventory[3] ? `[${invidivualWorthInventory[3].rarity}] ${invidivualWorthInventory[3].name} x${invidivualWorthInventory[3].count.toString()} -> **${comma(invidivualWorthInventory[3].value * invidivualWorthInventory[3].count)}** coin(s)\n` : "");
										let worth5 = (invidivualWorthInventory[4] ? `[${invidivualWorthInventory[4].rarity}] ${invidivualWorthInventory[4].name} x${invidivualWorthInventory[4].count.toString()} -> **${comma(invidivualWorthInventory[4].value * invidivualWorthInventory[4].count)}** coin(s)\n` : "");

										networthEmbed.addField(`🗃️ Inventory Bazaar Value - ${comma(Math.floor(inventoryWorth * 100) / 100)} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
									}
								
							});
						}
					}
				});
			});
		} catch (err) {
			console.error(err);
		}
	}
}
