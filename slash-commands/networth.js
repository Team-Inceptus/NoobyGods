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
					let profile = null;
					let entireProf = null;
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
					} else {
						profile = data.profiles[0];
					}

					const networthEmbed = new Discord.MessageEmbed();
					networthEmbed.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }), `https://crafthead.net/cube/${mojangplayer.name}.png`)
					networthEmbed.addFields(
						{ name: "👛Purse", value: `${profile.coin_purse.toString()} Coin(s)`, inline: true},
						{ name: "🏦Bank", value: `${entireProf.banking.balance ?? "Private Banking"}`, inline: true},
					);
					networthEmbed.setColor(config.)
					networthEmbed.setFooter(config.name, config.icon);
					networthEmbed.setTimestamp();

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
									let realName = removeChatColor(item.tag.value.display.value["Name"].value);

									let result = checkExistingProduct(realName);
									let value = Math.floor(result.quick_status.sellPrice * 100) / 100;
									if (result == false) return;
									let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1].split(' ')[0].substring(0, 3))
									else {
										individualWorth.push({
											name: realName,
											value: value,
											rarity: rarity,
										});

										bzWorth += value;
										inventoryWorth += value;
									}


								})
								invidivualWorthInventory.sort((a, b) => return b.value - a.value);

								let worth1 = invidivualWorthInventory[0] ? `[${invidivualWorthInventory[0].rarity}] ${invidivualWorthInventory[0].name} -> **${comma(invidivualWorthInventory[0].value)}** coin(s)\n` : " ";
								let worth2 = invidivualWorthInventory[1] ? `[${invidivualWorthInventory[1].rarity}] ${invidivualWorthInventory[1].name} -> **${comma(invidivualWorthInventory[1].value)}** coin(s)\n` : "";
								let worth3 = invidivualWorthInventory[2] ? `[${invidivualWorthInventory[2].rarity}] ${invidivualWorthInventory[2].name} -> **${comma(invidivualWorthInventory[2].value)}** coin(s)\n` : "";
								let worth4 = invidivualWorthInventory[3] ? `[${invidivualWorthInventory[3].rarity}] ${invidivualWorthInventory[3].name} -> **${comma(invidivualWorthInventory[3].value)}** coin(s)\n` : "";
								let worth5 = invidivualWorthInventory[4] ? `[${invidivualWorthInventory[4].rarity}] ${invidivualWorthInventory[4].name} -> **${comma(invidivualWorthInventory[4].value)}** coin(s)\n` : "";

								networthEmbed.addField(`🗃️Inventory Bazaar Value - ${inventoryWorth} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
						});
					}
					let enderchestWorth = 0;
					let invidivualWorthEnderchest = [];
					if (profile.ender_chest_contents) {
						await nbt.parse(Buffer.from(profile.ender_chest_contents.data), (err, data) => {
							data.value.i.value.value.forEach((item, index) => {
								let realName = removeChatColor(item.tag.value.display.value["Name"].value);

								let result = checkExistingProduct(realName);
								let value = Math.floor(result.quick_status.sellPrice * 100) / 100;
								if (result == false) return;
								let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1].split(' ')[0].substring(0, 3))
								else {
									individualWorth.push({
										name: realName,
										value: value,
										rarity: rarity,
									});

									bzWorth += value;
									enderchestWorth += value;
								}
							})
							invidivualWorthEnderchest.sort((a, b) => return b.value - a.value);

							let worth1 = invidivualWorthEnderchest[0] ? `[${invidivualWorthEnderchest[0].rarity}] ${invidivualWorthEnderchest[0].name} -> **${comma(invidivualWorthEnderchest[0].value)}** coin(s)\n` : " ";
							let worth2 = invidivualWorthEnderchest[1] ? `[${invidivualWorthEnderchest[1].rarity}] ${invidivualWorthEnderchest[1].name} -> **${comma(invidivualWorthEnderchest[1].value)}** coin(s)\n` : "";
							let worth3 = invidivualWorthEnderchest[2] ? `[${invidivualWorthEnderchest[2].rarity}] ${invidivualWorthEnderchest[2].name} -> **${comma(invidivualWorthEnderchest[2].value)}** coin(s)\n` : "";
							let worth4 = invidivualWorthEnderchest[3] ? `[${invidivualWorthEnderchest[3].rarity}] ${invidivualWorthEnderchest[3].name} -> **${comma(invidivualWorthEnderchest[3].value)}** coin(s)\n` : "";
							let worth5 = invidivualWorthEnderchest[4] ? `[${invidivualWorthEnderchest[4].rarity}] ${invidivualWorthEnderchest[4].name} -> **${comma(invidivualWorthEnderchest[4].value)}** coin(s)\n` : "";

							networthEmbed.addField(`🚚Enderchest Bazaar Value - ${enderchestWorth} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
						});
					}

					let backpackWorth = 0;
					let invidivualWorthBackpack = [];
					if (profile.backpack_contents) {
						for (const storageBackpack of Object.values(profile.backpack_contents)) {
							await nbt.parse(Buffer.from(storageBackpack.data, "base64"), (err, data) => {
								data.value.i.value.value.forEach((item, index) => {
									let realName = removeChatColor(item.tag.value.display.value["Name"].value);

									let result = checkExistingProduct(realName);
									let value = Math.floor(result.quick_status.sellPrice * 100) / 100;
									if (result == false) return;
									let rarity = removeChatColor(item.tag.value.display.value["Lore"].value.value[item.tag.value.display.value["Lore"].value.value.length - 1].split(' ')[0].substring(0, 3))
									else {
										individualWorth.push({
											name: realName,
											value: value,
											rarity: rarity,
										});

										bzWorth += value;
										backpackWorth += value;
									}
								});
								invidivualWorthBackpack.sort((a, b) => return b.value - a.value);

								let worth1 = invidivualWorthBackpack[0] ? `[${invidivualWorthBackpack[0].rarity}] ${invidivualWorthBackpack[0].name} -> **${comma(invidivualWorthBackpack[0].value)}** coin(s)\n` : " ";
								let worth2 = invidivualWorthBackpack[1] ? `[${invidivualWorthBackpack[1].rarity}] ${invidivualWorthBackpack[1].name} -> **${comma(invidivualWorthBackpack[1].value)}** coin(s)\n` : "";
								let worth3 = invidivualWorthBackpack[2] ? `[${invidivualWorthBackpack[2].rarity}] ${invidivualWorthBackpack[2].name} -> **${comma(invidivualWorthBackpack[2].value)}** coin(s)\n` : "";
								let worth4 = invidivualWorthBackpack[3] ? `[${invidivualWorthBackpack[3].rarity}] ${invidivualWorthBackpack[3].name} -> **${comma(invidivualWorthBackpack[3].value)}** coin(s)\n` : "";
								let worth5 = invidivualWorthBackpack[4] ? `[${invidivualWorthBackpack[4].rarity}] ${invidivualWorthBackpack[4].name} -> **${comma(invidivualWorthBackpack[4].value)}** coin(s)\n` : "";

								networthEmbed.addField(`<:backpack:884335653268094997>Backpack Bazaar Value - ${backpackWorth} Coin(s)`, `${worth1}${worth2}${worth3}${worth4}${worth5}`);
							});
						}
					}

					networthEmbed.setDescription(`${mojangplayer.name}'s Bazaar-Only-Items In-Game Networth is **${comma(bzWorth)}**\nBazaar-Only-Items IRL Networth is **${${Math.floor((bzWorth / products["BOOSTER_COOKIE"].quick_status.buyPrice) * 100) / 100}$**`);
				}
			});
		});
	}
}
