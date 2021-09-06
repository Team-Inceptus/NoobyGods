module.exports = {
	name: 'guildcommand',
	description: 'Runs a guild command.',
	aliases: ['gcmd', 'guildc', 'gc'],
	async run(client, message, args) {
		const { bot } = require('../index.js');
		if (!(message.member.hasPermission('MANAGE_MESSAGES'))) return message.channel.send('You do not have permission to use this command.');

		if (args.length < 1) return message.channel.send('Please provide valid arguments.');

		let argument = args.slice(0).join(' ');

		bot.chat(`/g ${argument}`);

		message.channel.send(`Command "\`/g ${argument}\`"sent successfully.`);
		

	}
}
