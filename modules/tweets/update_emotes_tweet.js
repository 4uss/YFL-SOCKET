import Twit from "twit";
import dotenv from "dotenv";

dotenv.config()

const T = new Twit({
    consumer_key:         process.env.TWITTER_API_KEY,
    consumer_secret:      process.env.TWITTER_API_KEY_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

async function update_emotes_tweet(i){
    T.post('statuses/update', { status: `BREAKING: ${i.channel} ${i.action === "ADD" ? ("dodał"):("usunął")} emotke ➡️ "${i.emote_name}"
https://next.7tv.app/emotes/${i.emote_id}
#YFL #7TV` }, function(err, data, response) {
        console.log("EMOTE UPDATE "+i.channel)
    })
}

export default update_emotes_tweet;