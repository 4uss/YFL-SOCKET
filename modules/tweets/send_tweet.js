import {twit_updates} from "../../config/index.js";
import imageToBase64 from "image-to-base64";

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
    
    twit_updates.post('media/upload', { media_data: base64 }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        const mediaIdStr = data.media_id_string
        const altText = i.nickname+" odpalił stream"
        const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
       
        twit_updates.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: `${i.nickname} odpalił stream ➡️ https://www.twitch.tv/${i.nickname}
${i.title}
#YFL`, media_ids: [mediaIdStr] }
       
            twit_updates.post('statuses/update', params, function (err, data, response) {
              console.log('Dodano post twitter')
            })
          }
        })
    })
}

export default send_tweet;