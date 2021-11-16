const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("bazaar")
	.setDescription("NoobyBot's Bazaar Portal"),
	async run(client, interaction) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);

		const timedOut = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setDescription(`This menu has timed out. Please use the command again.`)
		.setFooter(config.name, config.icon)
		.setTimestamp();
		try {
			const bazaarEmbed = new Discord.MessageEmbed()
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
			.setDescription(`Welcome to NoobyBot's Bazaar Portal. Type any item at any time to see its status. (If you get one wrong, you can keep trying by typing it again.) This message will time out in 3 minutes.`)
			.setColor(config.emerald)
			.setFooter(config.name, config.icon)
			.setTimestamp();
			const bazaarM = await interaction.reply({ embeds: [bazaarEmbed]});
			const products = await hypixel.getSkyblockBazaar();

			const bazaarFilter = msg => msg.author.id === interaction.user.id && !msg.author.bot;

			const bazaarCollector = interaction.channel.createMessageCollector(bazaarFilter, { time: 180000 })

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
			function incorrectItem() {
				bazaarEmbed.setDescription(`You have entered an incorrect product ID. Try typing it again.`)
				bazaarM.edit(bazaarEmbed);
			}
			function capitalize(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			}

			function comma(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			bazaarCollector.on('collect', (m) => {
				m.delete();
				const item = checkExistingProduct(m.content);
				if (item === false) incorrectItem();
				else {
					bazaarEmbed.setDescription(`Item: \`${capitalize(item.productId.replace(/[_]/g, ' ').toLowerCase())}\`\n\n**__General Stats__**\n__Prices__\nBuy Price: \`${comma(item.status.buyPrice)}\` coins\nSell Price: \`${comma(item.status.sellPrice)}\` coins\n\nTotal Buy Orders: \`${comma(item.status.buyOrders)}\`\nTotal Sell Orders: \`${comma(item.status.sellOrders)}\`\n\n__**Advanced Stats**__\n__Volume Pricing__\nBuy Volume: \`${comma(item.status.buyVolume)}\`\nSell Volume: \`${comma(item.status.sellVolume)}\`\n\n__Totals__\nTotal Bought (weekly, raw): \`${comma(item.status.buyMovingWeek)}\`\nTotal Sold (weekly, raw): \`${comma(item.status.sellMovingWeek)}\``);
					bazaarM.edit({ embeds: [bazaarEmbed]});
				}
			})
			bazaarCollector.on('end', (collected) => {
				bazaarM.edit(timedOut);
			})
		} catch (error) {
			console.error(error);
			interaction.reply(config.error);
		}
	}
}