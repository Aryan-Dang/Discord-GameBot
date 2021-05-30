const Discord = require('discord.js');
const config = require('./config.json');
const classFile = require('./tictactoe.js');

const client = new Discord.Client();
const {prefix, TOKEN} = config;
let game = undefined;
const noMappings = require('./mappings.json')
let reacts = [];

const filter = (reaction,user) => !user.bot;

const filter2 = (reaction,user) => !user.bot && user.username !== game.prevMove
    && game.remNos.map(g => noMappings[g.toString()]).find(str => str === reaction.emoji.name) !== undefined
    && Object.keys(game.nameSign).find(name => name === user.username) !== undefined;
;

function playGame(message){
    reacts = game.remNos.map(g => noMappings[g.toString()]);

    message.channel.send(game.print())
    .then(performMove)
    .catch(console.log);
}

function performMove(m){
    reacts.forEach(r => m.react(r));
    const collector = m.createReactionCollector(filter2, {max : 1});

    collector.on('collect', async (reaction, user) => {
        await m.channel.send(`${user.username} reacted with ${reaction.emoji.name}`)
        const react = reaction.emoji.name;
        
        //Object.entries returns an array of form [key,value] then string is converted to number
        const move = Number(Object.entries(noMappings).find(arr => arr[1] === react)[0]);
        console.log(move);
        console.log(game.move(move,user.username));

        game.isOver ? m.channel.send('game is over now') : playGame(m);

    });

}
client.once('ready', () => {
	console.log('Ready!');

});

client.on('message', async message => {
    if (!message.content.startsWith(prefix)) return;

    //args contains all arguments as a string[]
	const args = message.content.slice(prefix.length).trim().split(/ +/);

    //gets first command and removes it from args
    const command = args.shift().toLowerCase();

    if(command === 'tictactoe'){

        const introMsg = await message.channel.send('tictactoe game starting\nThe 2 people who wish to play should react below')
        let playerNames = [];
        await introMsg.react('🙋');
        //prolly remove the time constraint here too but don't move collected code up -- plays a imp role since we've 2 msgs here
        const collector = introMsg.createReactionCollector(filter, { max : 2, time: 7500 });
        collector.on('collect',(react,user) => {
            introMsg.channel.send(`${user.username} is playing!`);
            playerNames.push(user.username);
        });
        collector.on('end',collected => {
            console.log(playerNames);
            game = new classFile.TicTacToe(...playerNames);
            playGame(message);
        });

    }
});


client.login(TOKEN);

//TODO : print who won
//TODO : Remove reactions from previous messages
//TODO : Handle errors
//TODO : player who react first go first
//TODO: Tie condition checkk better