const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Fetch Guild Roles.')
		.addStringOption(option => 
		option.setName('role')
		.setDescription('The Name of the role you want given from /roles')
		.setRequired(false)),
	async run(client, interaction) {
		const Discord = require('discord.js');
		const config = require('../config.json');

		try {
			if (!interaction.options.getString('role')) {
				const rolesEmbed = new Discord.MessageEmbed()
				.setColor(config.emerald)
				.setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
				.setDescription(`__Self Roles__\n\`/roles smp\` - <@&823080440365711360>\n\`/roles bot\` - <@&824736567184326666>\n\`/roles news\` - <@&836683798242000947>\n\`/roles reporter\` - <@&837727007831228438>`)
				.setFooter(config.name, config.icon)
				.setTimestamp();
				await interaction.reply({ embeds: [rolesEmbed]});
			} else if (interaction.options.getString('role').toLowerCase() == 'smp') {
				if (!interaction.member.roles.cache.has('823080440365711360')) {
					interaction.member.roles.add('823080440365711360');
					await interaction.reply('Equipped \'SMP Announcements\'.');
				} else {
					interaction.member.roles.remove('823080440365711360');
					await interaction.reply('Dequipped \'SMP Announcements\'.');
				}
			} else if (interaction.options.getString('role').toLowerCase() == 'bot') {
				if (!interaction.member.roles.cache.has('824736567184326666'))	{		interaction.member.roles.add('824736567184326666');
					await interaction.reply('Equipped \'Bot Updates\'.');
				} else {
					interaction.member.roles.remove('824736567184326666');
					await interaction.reply('Dequipped \'Bot Updates\'.');
				}
			} else if (interaction.options.getString('role').toLowerCase() == 'news') {
				if (!interaction.member.roles.cache.has('836683798242000947'))	{		interaction.member.roles.add('836683798242000947');
					await interaction.reply('Equipped \'News Ping\'.');
				} else {
					interaction.member.roles.remove('836683798242000947');
					await interaction.reply('Dequipped \'News Ping\'.');
				}
			} else if (interaction.options.getString('role').toLowerCase() == 'reporter') {
				if (!interaction.member.roles.cache.has('837727007831228438'))	{		interaction.member.roles.add('837727007831228438');
					await interaction.reply('Equipped \'Reporter Ping\'.');
				} else {
					interaction.member.roles.remove('837727007831228438');
					await interaction.reply('Dequipped \'Reporter Ping\'.');
				}
			} else if (interaction.options.getString('role').toLowerCase() == 'creation') {
				if (!interaction.member.roles.cache.has('844704147680133130'))	{		interaction.member.roles.add('844704147680133130');
					await interaction.reply('Equipped \'Creations Ping\'.');
				} else {
					interaction.member.roles.remove('844704147680133130');
					await interaction.reply('Dequipped \'Creations Ping\'.');
				}
			}
		} catch (err) {
			console.error(err);
			await interaction.reply(config.error);
		}
	}
}