import {twit_updates} from "../../config/index.js";

async function update_emotes_tweet(i){
    twit_updates.post('statuses/update', { status: `BREAKING: ${i.channel} ${i.action === "ADD" ? ("dodał"):("usunął")} emotke ➡️ "${i.emote_name}"
https://7tv.app/emotes/${i.emote_id}
#YFL #7TV` }, function(err, data, response) {
        console.log("EMOTE UPDATE "+i.channel)
    })
}

export default update_emotes_tweet;