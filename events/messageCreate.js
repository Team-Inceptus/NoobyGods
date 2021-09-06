module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	const Discord = require('discord.js');
	
    const { bot } = require('../index.js');
    
    if (message.channel.id == '863587484074901505') {
        
        let nick = message.author.username;
        
        bot.chat(`/gc [${nick}] ${message.content}`)
    }
	var prefix = '/'
	var prefix2 = '-';
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix) && !message.content.startsWith(prefix2)) return;

  const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
	if (!command) return;
	try {
		let blacklist = [
			'707036253048012851'
		]
		if (command.disabled && message.author.id !== '572173428086538270') return message.channel.send('This command has been temporarily disabled. Please check back later.');
		if (command.admin && !message.member.roles.cache.has('801501790939906048')) return message.channel.send('This command is for Admins and Owners of the guild only.');
		if (command.owner && message.author.id !== '572173428086538270') return message.channel.send('This command is for the Owner of the guild only.');
		if (message.channel.id !== '801503200846282823' && message.channel.id !== '806538507614552104' && message.channel.id !== '806538708680966144' && message.channel.id !== '802331427466903552' && message.channel.id !== '801515793044340757' && command.name !== 'suggest' && command.name !== 'assertdominance' && command.name !== 'smp') {
			return message.channel.send(`This is not a bot commands channel.`)
		}
		if (command && blacklist.includes(message.author.id)) {
			return message.channel.send('You have been blacklisted from using my commands.');
		}
		if (command) command.run(client, message, args);
	} catch (err) {
		console.error(err);
		message.reply(config.error);
	}
}