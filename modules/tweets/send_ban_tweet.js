import Twit from "twit";
import dotenv from "dotenv";
dotenv.config()

const T = new Twit({
    consumer_key:         process.env.TWITTER_BANS_API_KEY,
    consumer_secret:      process.env.TWITTER_BANS_API_KEY_SECRET,
    access_token:         process.env.TWITTER_BANS_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_BANS_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

async function send_ban_tweet(channel, username){
    if(channel === "#xspeedyq" || channel === "#xkaleson" || channel === "#adrian1g__") return;

    T.post('statuses/update', { status: `${username.toUpperCase()} został zbanowany na kanale ${channel}

🕒 ${new Date().toLocaleString('pl')}
#TWITCH #YFLBANS` }, function(err, data, response) {
    console.log(err)
    })
}

export default send_ban_tweet;