module.exports = {
	name: 'updatechannels',
	description: 'Updates Count Channels',
	admin: true,
	aliases: ['updatech', 'upchannels', 'upch'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const Hypixel = require('hypixel-api-reborn');

		const hypixel = new Hypixel.Client(process.env.HYPIXEL_TOKEN);
		try {
		const guild = await hypixel.getGuild('player', 'GamerCoder215');
		const dguild = message.guild;
		let oldDiscordName = client.channels.cache.get('811266928706060319').name;
		let oldname = client.channels.cache.get('811266809353076737').name;
		let oldchannelcount = client.channels.cache.get('863431471178973214').name;

		const channelsUpdated = new Discord.MessageEmbed()
		.setColor(config.emerald)
		.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 }))
		.setDescription(`__Listing Channels Updated__\nMod: ${message.author.tag} (<@${message.author.id}>)`)
		.setTimestamp();

		if (oldname !== `Guild Members: ${guild.members.length}`) {
			channelsUpdated.addField(`New Name: "Guild Members: ${guild.members.length}"`, `Old Name: "${oldname}"`);
			client.channels.cache.get('811266809353076737').setName(`Guild Members: ${guild.members.length}`)
		}

		if (oldchannelcount !== `Channel Count: ${dguild.channels.cache.size}`) {
			channelsUpdated.addField(`New Name: "Channel Count: ${dguild.channels.cache.size}"`, `Old Name: "${oldchannelcount}"`);
			client.channels.cache.get('863431471178973214').setName(`Channel Count: ${dguild.channels.cache.size}`);
		}
		if (oldDiscordName !== `Discord Members: ${dguild.members.cache.size}`) {
			channelsUpdated.addField(`New Name: "Discord Members: ${dguild.memberCount}"`, `Old Name: "${oldDiscordName}"`);
			client.channels.cache.get('811266928706060319').setName(`Discord Members: ${dguild.memberCount}`);
		}
		if (channelsUpdated.fields.length < 1) return message.channel.send(`No Updates were recorded.`);
		else return client.channels.cache.get('801508720382967870').send({ embeds: [channelsUpdated]});

		} catch (err) {
			console.error(err);
		}
	}
}