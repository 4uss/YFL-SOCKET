import Twit from "twit";

const T = new Twit({
    consumer_key:         process.env.TWITTER_BANS_API_KEY,
    consumer_secret:      process.env.TWITTER_BANS_API_KEY_SECRET,
    access_token:         process.env.TWITTER_BANS_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_BANS_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

export default T;