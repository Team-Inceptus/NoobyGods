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
				.addChoice("Bazaar Only", "bz_only")
				.addChoice("AH Only", "ah_only")
				.addChoice("Both & AH Lowest BIN", "both_lowest_bin")
				.addChoice("Both & AH Highest BIN", "both_highest_bin"))
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
				let profileNumber = 1;

				function isCorrectProfile(item, index) {
					const caps = interaction.options.getString('profile').charAt(0).toUpperCase() + interaction.options.getString('profile').slice(1);

					if (item.cute_name == caps) {
						profile = item.members[mojangplayer.id];
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
				
				if (option == "bz_only") {
					const products = await hypixel.getSkyblockBazaar();
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
					let invidivualWorthInventory = [];

					await nbt.parse(Buffer.from(profile.inv_contents.data, "base64"), (err, data) => {
						data.value.i.value.value.forEach(item => {
							let realName = removeChatColor(item.tag.value.display.value["Name"].value);

							let result = checkExistingProduct(realName);

							if (result == false) return;
							else {
								individualWorth.push({
									name: realName,
									value: Math.floor(result.quick_status.sellPrice * 100) / 100
								});
							}
							
						})
					});

					
				}
			});
		});
	}
}