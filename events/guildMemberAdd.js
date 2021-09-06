module.exports = async (client, member) => {
	const Discord = require('discord.js');
	const config = require('../config.json');

	try {
		if (member.guild.id == '837309158662340651') return;
		const joinEmbed = new Discord.MessageEmbed()
		.setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
		.setColor(config.emerald)
		.setDescription(`Welcome <@${member.user.id}> to **TheNoobyGods**!\nRemember to read <#801502439244562550> and also check <#801510666191110184> and <#801503897150685216>.\n\nID: ${member.user.id}\nTag: \`${member.user.tag}\``)
		client.channels.cache.get('801508720382967870').send({ content: `<@${member.user.id}>`, embeds: [joinEmbed]});
		member.roles.add('801501891501883403');
	} catch (error) {
		console.error(error);
	}
}