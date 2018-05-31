const fs = require('fs');
const config = require('./config.json');
const irc = require('irc');
const commands = {};
const commandQueue = [];

// load all commands
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands[command.name] = command;
}

const osuClient = new irc.Client({
	server: config.osu.server,
	nick: config.osu.user,
	password: config.osu.pass,
	port: config.osu.port,
	channels: []
});
osuClient.addListener('error', function(message) {
    console.log('osu: error: ', message);
});

const prefix = config.twitch.prefix;
const twitchClient = new irc.Client({
	server: config.twitch.server,
	nick: config.twitch.user,
	password: config.twitch.pass,
	port: config.twitch.port,
	channels: ['#'+config.twitch.user]
});
twitchClient.whois = function() { return; }; // overwrite WHOIS command since twitch irc doesn't support it
twitchClient.addListener('message', function (from, to, message) {
	if (!message.startsWith(prefix)) return; // check for prefix
	const args = message.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	// check if it's an actual command
	if (!commands.hasOwnProperty(commandName)) return;
	const command = commands[commandName];
	console.log(from + ' => ' + to + ': ' + message);
	command.execute(from, osuClient, twitchClient, args);
});
twitchClient.addListener('error', function(message) {
	console.log('twitch: error: ', message);
});