const Discord = require('discord.js');
const config = require('./config.json');
const classFile = require('./tictactoe.js');

const client = new Discord.Client();
const {prefix, TOKEN} = config;
let game = new classFile.TicTacToe();
const noMappings = require('./mappings.json')
let reacts = [];

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

        reacts = game.remNos.map(g => noMappings[g.toString()]);
        
        const filter = (reaction,user) => {
            console.log(reaction.emoji.name);
            return true;
        }

        let newMsg = message.channel.send(game.print())
        .then(m => {
            reacts.forEach(r => m.react(r))
            const collector = m.createReactionCollector(filter, { time: 30000 });

            collector.on('collect', (reaction, user) => {
                m.channel.send(`Collected ${reaction.emoji.name} from ${user.tag}`);
            });
            
            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });
            
        })
        .catch(m => console.log(m));

    }

});


client.login(TOKEN);
