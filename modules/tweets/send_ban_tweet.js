import {twit_bans} from "../../config/index.js";

async function send_ban_tweet(i){

    twit_bans.post('statuses/update', { status: `${i.banned.toUpperCase()} został zbanowany na kanale ${i.channel}

#YFL #TWITCH #YFLBANS` }, function(err, data, response) {
    })
}

export default send_ban_tweet;