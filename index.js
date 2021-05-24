const Discord = require('discord.js');
const config = require('./config.json');
const classFile = require('./tictactoe.js');

const client = new Discord.Client();
const {prefix, TOKEN} = config;
let game = new classFile.TicTacToe();


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;

    //args contains all arguments as a string[]
	const args = message.content.slice(prefix.length).trim().split(/ +/);

    //gets first command and removes it from args
    const command = args.shift().toLowerCase();

    if(command === 'tictactoe'){
        message.channel.send('tictactoe game starting');
        game.reset();
        message.channel.send(game.print());
    }


});

client.login(TOKEN);
