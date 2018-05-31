# Discord bot

Bot connecting twitch chat with your osu account created using [node.js](https://nodejs.org/), [request](https://github.com/request/request) and slightly modified [node-irc](https://github.com/martynsmith/node-irc)

## Getting Started

You will need to download and install:

node.js: https://nodejs.org/en/download/

If you're on linux, you may want to look at this page instead: https://nodejs.org/en/download/package-manager/

After cloning this repo you need to fill in this data in your config.json:
in osu:
user: your osu! username (replace spaces to underscores)
pass: get it at [IRC Authentication](https://osu.ppy.sh/p/irc)
apikey: get it from [here](https://osu.ppy.sh/p/api)
in twitch:
user: your Twitch user name in lowercase
pass: get it from [here](https://twitchapps.com/tmi/)
 
Then you can start the bot using this command:
```
$ node ircbot.js
```