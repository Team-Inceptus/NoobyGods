module.exports = async (client, interaction) => {
	const config = require('../config.json');

	if (!(interaction.isCommand())) return;

	if (!client.slashcommands.has(interaction.commandName)) return;
	try {
		await client.slashcommands.get(interaction.commandName).run(client, interaction)
		.catch(err => {
			console.error(err);
			interaction.channel.send(config.error);
		});
	} catch (error) {
		console.error(error);
		interaction.channel.send(config.error);
	}
}