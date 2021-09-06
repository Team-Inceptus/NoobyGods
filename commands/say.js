module.exports = {
	name: 'say',
	description: 'Says something through TTS.',
	admin: true,
	aliases: ['tts', 'speak'],
	async run(client, message, args) {
		const Discord = require('discord.js');
		const config = require('../config.json');
		const googleTTS = require('node-google-tts-api');
		const tts = new googleTTS();
		const fs = require('fs');

		try {
			if (!message.member.voice.channel && !args[0]) return message.channel.send(`You need to be in a voice channel, or supply an ID.`);
			let msg = args.slice(0).join(' ');
			if (!msg) return message.channel.send(`You need to provide something for the bot to talk about!`);
			let connection = await message.member.voice.channel.join();
			tts.get({
			text: msg,
			lang: "en"
			}).then(async data => {
			fs.writeFileSync('audio.mp3', data);
			const dispatcher = await connection.play('audio.mp3');

			dispatcher.on('finish', () => {
				fs.unlinkSync('audio.mp3');
			})
			message.channel.send('Message sent sucessfully.');
			})
		} catch (err) {
			console.error(err);
			message.reply(config.error);
		}
	}
}