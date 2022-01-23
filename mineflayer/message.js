const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index.js');
const fetch = require('node-fetch');
module.exports = async (bot, jsonMsg, position) => {
	try {
		fetch(`https://api.mojang.com/users/profiles/minecraft/${(jsonMsg.extra && jsonMsg.text == 'Guild > ' && (jsonMsg.extra[1].text == 'left.' || jsonMsg.extra[1].text == 'joined.')) ? jsonMsg.extra[0].text.replace(/[ ]/g, '') : "steve"}`)
		.then(res => res.json())
		.then(data => {
		
		let uuid = data.id ? data.id : "8667ba71b85a4004af54457a9734eed7"
		const gchannel = client.channels.cache.get('907803778823110656');
		if (gchannel == null) return;
		if (gchannel.isText()) {
			const joinEmbed = new Discord.MessageEmbed()
			.setColor(config.emerald)
			.setAuthor(`${jsonMsg.extra ? jsonMsg.extra[0].text : null}is now online.`, `https://crafatar.com/avatars/${uuid}.png`)
			.setTimestamp();
			// Leave embed
			const leaveEmbed = new Discord.MessageEmbed()
			.setColor(config.red)
			.setAuthor(`${jsonMsg.extra ? jsonMsg.extra[0].text : null}is now offline.`, `https://crafatar.com/avatars/${uuid}.png`)
			.setTimestamp();
			// If Message starts with guild
			if (jsonMsg.text == 'Guild > ' && jsonMsg.extra[1].text == 'left.') {
					gchannel.send({ embeds: [leaveEmbed]});
			} else if (jsonMsg.text == 'Guild > ' && jsonMsg.extra[1].text == 'joined.') {
					gchannel.send({ embeds: [joinEmbed]});
			}
	
			if (jsonMsg.extra) {
					if (jsonMsg.text == '' && jsonMsg.extra[0].text.startsWith('§2Guild > ')) {
	
							let username = jsonMsg.extra ? jsonMsg.extra[0].text.replace('§2Guild > ', '').replace(/§7/g, '').replace(/§f/g, '').replace(/§3/g, '').replace(/§a/g, '').replace(/§6/g, '').replace(/§b/g, '').replace(/§d/, '').replace(/§c/g, '').replace(/§d/g, '').replace(/§e/g, '').replace(/§1/g, '').replace(/§0/g, '').replace(/§2/g, '').replace(/§4/g, '').replace(/§5/g, '').replace(/§8/g, '').replace(/§9/g, '').replace('[VIP] ', '').replace('[VIP+]', '').replace('[MVP]', '').replace('[MVP+]', '').replace('[MVP++]', '').replace('[P]', '').replace('[DGD]', '').replace('[GM]', '').replace('[BG]', '').replace('[EX]', '').replace('[GD]', '').replace(' :', '') : null;
							let displayName = jsonMsg.extra ? jsonMsg.extra[0].text.replace('§2Guild > ', '').replace(/§7/g, '').replace(/§f/g, '').replace(/§3/g, '').replace(/§a/g, '').replace(/§6/g, '').replace(/§b/g, '').replace(/§d/, '').replace(/§c/g, '').replace(/§d/g, '').replace(/§e/g, '').replace(/§1/g, '').replace(/§0/g, '').replace(/§2/g, '').replace(/§4/g, '').replace(/§5/g, '').replace(/§8/g, '').replace(/§9/g, '').replace(' :', '') : null;
	
							let msg = jsonMsg.extra ? jsonMsg.extra[1].text : null;
							if (username !== null && msg !== null) {
									fetch(`https://api.mojang.com/users/profiles/minecraft/${username.replace(/[ ]/g, '')}`)
									.then(res => res.json())
									.then(p => {
									// Message Embed
									const messageEmbed = new Discord.MessageEmbed()
									.setColor(config.emerald)
									.setAuthor(displayName, `https://crafatar.com/avatars/${p.id}.png`)
									.setDescription(msg)
									.setFooter(config.name, config.icon)
									.setTimestamp();
									gchannel.send({ embeds: [messageEmbed]});
									})
									if (msg.toLowerCase() == '/ping' || msg.toLowerCase() == '-ping') {
										bot.chat(`/gc Pong! Latency is ${bot.player.ping}ms.`);
									}
							}
					}
			}
		}
		})
	} catch (err) {
		console.error(err)
	}
}