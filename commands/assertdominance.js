module.exports = {
	name: 'assertdominance',
	description: 'Assert Dominance.',
	async run(client, message, args) {
		if (message.author.id !== '572173428086538270') return message.channel.send('You have no power here.');
		else {
			message.channel.send('GamerCoder215 has asserted dominance. There is nothing you can do.')
		}
	}
}