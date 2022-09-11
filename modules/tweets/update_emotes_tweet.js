import {twit_updates} from "../../config/index.js";

async function update_emotes_tweet(i){
    twit_updates.post('statuses/update', { status: `${i.channel.toUpperCase()} ${i.action === "ADD" ? ("dodał"):("usunął")} emotke ➡️ "${i.emote_name}"` }, function(err, data, response) {
        // console.log("EMOTE UPDATE "+i.channel)
    })
}

export default update_emotes_tweet;