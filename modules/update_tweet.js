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

async function update_tweet(i){

    //console.log(i)
    T.post('statuses/update', { status: `AKTUALIZACJA: ${i.nickname} gra teraz w ➡️ ${i.game}
https://www.twitch.tv/${i.nickname}
${i.title}
#YFL${i.game === "Grand Theft Auto V" ? (" #5CITY"):("")}` }, function(err, data, response) {
        console.log("Dodano aktualizacje "+i.nickname)
    })
}

export default update_tweet;