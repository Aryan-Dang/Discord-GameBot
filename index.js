import { TicTacToe } from './tictactoe.js';
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = "Nzc5NzU4MzYzMjE5MDY2OTAw.X7lMkQ.lorJEyLiTA5h4AR9qv_OBOzMEEs";
let tic = new TicTacToe();


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
        tic.reset();
        tic.print();
    }


});

client.login(TOKEN);
