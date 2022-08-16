import {twit_bans} from "../../config/index.js";

async function send_ban_tweet(i){

    twit_bans.post('statuses/update', { status: `${i.banned.toUpperCase()} został zbanowany na kanale ${i.channel}

https://yfl.seven7s.top/user/${i.banned}
#YFL #TWITCH #YFLBANS` }, function(err, data, response) {
    })
}

export default send_ban_tweet;