const Discord = require('discord.js');
const config = require('./config.json');
const classFile = require('./tictactoe.js');

const client = new Discord.Client();
const {prefix, TOKEN} = config;
let game = undefined;
const noMappings = require('./mappings.json')
let reacts = [];

const filter = (reaction,user) => !user.bot;

//double check filter function with 2 players
const filter2 = (reaction,user) => !user.bot && user.username !== game.prevMove;

function playGame(message){
    reacts = game.remNos.map(g => noMappings[g.toString()]);

    message.channel.send(game.print())
    .then(performMove)
    .catch(console.log);
}

function performMove(m){
    reacts.forEach(r => m.react(r))
    const collector = m.createReactionCollector(filter2, { max : 1, time: 10000 });

    collector.on('collect', (reaction, user) => {
        m.channel.send(`${user.username} reacted with ${reaction.emoji.name}`)
        .then(msg => {
            const react = reaction.emoji.name;
            
            //Object.entries returns an array of form [key,value] then string is converted to number
            const move = Number(Object.entries(noMappings).find(arr => arr[1] === react)[0]);
            console.log(move);
            console.log(game.move(move,user.username));
            msg.channel.send('!game');
        });
    });
    
    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
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
        await introMsg.react('🙋')
        const collector = introMsg.createReactionCollector(filter, { max : 3, time: 10000 });
        collector.on('collect',(react,user) => {
            introMsg.channel.send(`${user.username} is playing!`);
            playerNames.push(user.username);
        });
        collector.on('end',collected => {
            console.log(playerNames);
            game = new classFile.TicTacToe(playerNames,'hello');
            playGame(message);
        });

    }

    if(command === 'game' && message.author.username === 'GameBot'){
        message.channel.send('sent by GameBot');
        if(game.isOver){
            message.channel.send('game is over now :joy:');
        }
        else playGame(message);
    }

});


client.login(TOKEN);
