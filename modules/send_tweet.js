import Twit from "twit";
import dotenv from "dotenv";
import imageToBase64 from "image-to-base64";

dotenv.config()

const T = new Twit({
    consumer_key:         process.env.TWITTER_API_KEY,
    consumer_secret:      process.env.TWITTER_API_KEY_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

async function getBase64 (url){
    try {
        const resp = await imageToBase64(url)

        return resp;

    } catch (err) {
        console.error(err);
        return {
            error: "error",
            message: "Something went wrong!"
        }
    }
}
async function send_tweet(i){
    const base64 = await getBase64(i.thumbnail)
    if(base64.error) return;
    
    T.post('media/upload', { media_data: base64 }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        const mediaIdStr = data.media_id_string
        const altText = i.nickname+" odpalił stream"
        const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
       
        T.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: `${i.nickname} odpalił stream ➡️ 
https://www.twitch.tv/${i.nickname}
${i.title}
#YFL`, media_ids: [mediaIdStr] }
       
            T.post('statuses/update', params, function (err, data, response) {
              console.log('Dodano post twitter')
            })
          }
        })
    })
}

export default send_tweet;