const config = require('../config.json');
const request = require('request');
const modes = ['std', 'taiko', 'ctb', 'mania'];

function say(from, osuClient, beatmapLink, body) {
	console.log(body.artist+' - '+body.title+' ['+body.version+']');
	osuClient.say(config.osu.user, from+' => ['+beatmapLink+' '+body.artist+' - '+body.title+' ['+body.version+']]  (osu!'+
		modes[parseInt(body.mode)]+' | '+parseFloat(body.difficultyrating).toPrecision(2)+'★ | '+body.bpm+' BPM)');
}

module.exports = {
	name:'r',
    //aliases:['req', 'request'],
	execute(from, osuClient, twitchClient, args) {
		/* currently there are three types of osu beatmap links, f.e:
		 * (1) https://osu.ppy.sh/beatmapsets/<beatmapset_id>#<mode>/<beatmap_id>
		 * (2) https://osu.ppy.sh/b/<beatmap_id>&m=<mode_id>
		 * (3) https://osu.ppy.sh/s/<beatmapset_id>
		 * possible <mode>s are:
		 * - osu
		 * - taiko
		 * - fruits (LUL CTB)
		 * - mania
		 * possible <mode_id>s are:
		 * - 0 = std
		 * - 1 = taiko
		 * - 2 = ctb
		 * - 3 = mania
		 * in case of (3), highest diff of the lowest available <mode_id> should be chosen */
		const beatmapLink = args.shift();
		if (RegExp(/^https:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/[0-9]+$/).test(beatmapLink)) { // regex for (1)
			const beatmapID = (beatmapLink.split(/\/+/))[4];
			
			request("https://osu.ppy.sh/api/get_beatmaps?k="+config.osu.apikey+"&b="+beatmapID, { json: true }, (err, res, body) => {
				if (err) return console.log(err);
				say(from, osuClient, beatmapLink, body[0]);
			});
		}
		else if (RegExp(/^https:\/\/osu.ppy.sh\/b\/[0-9]+\?m=[0-3]$/).test(beatmapLink)) { // regex for (2)
			const beatmapID = ((beatmapLink.split(/\/+/))[3].split(/\&/))[0];
			
			request("https://osu.ppy.sh/api/get_beatmaps?k="+config.osu.apikey+"&b="+beatmapID, { json: true }, (err, res, body) => {
				if (err) return console.log(err);
				say(from, osuClient, beatmapLink, body[0]);
			});
		}
		else if (RegExp(/^https:\/\/osu.ppy.sh\/s\/[0-9]+$/).test(beatmapLink)) { // regex for (3)
			const beatmapsetID = (beatmapLink.split(/\/+/))[3];
			
			request("https://osu.ppy.sh/api/get_beatmaps?k="+config.osu.apikey+"&s="+beatmapsetID, { json: true }, (err, res, body) => {
				if (err) return console.log(err);
				body.sort(function(a, b) {
					if (parseInt(a.mode) == parseInt(b.mode)) return parseFloat(a.difficultyrating) < parseFloat(b.difficultyrating);
					return parseInt(a.mode) > parseInt(b.mode);
				});
				say(from, osuClient, beatmapLink, body[0]);
			});
		}
	}
};	