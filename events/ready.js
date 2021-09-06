module.exports = async (client) => {
	console.log('NoobyBot is up and running.');
	client.user.setPresence({
		status: 'dnd',
		activities: [{
			name: `Minecraft`,
			type: 'PLAYING'
		}]
	})
}