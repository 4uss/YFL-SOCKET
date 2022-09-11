import {twit_updates} from "../../config/index.js";
import {game_generator} from "../images/index.js"
import {generateString} from "../../components/index.js"

async function update_game_tweet(i){

    const result = await game_generator.convert({
      scheme: {
          name: i.nickname,
          game: i.game,
          title: i.title,
          viewer: i.viewer_count,
      },
    })

    twit_updates.post('media/upload', { media_data: JSON.stringify(await result.getBase64()).substring(24) }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        const mediaIdStr = data.media_id_string
        const meta_params = { 
          media_id: mediaIdStr
        }
       
        twit_updates.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: `
https://www.twitch.tv/${i.nickname}
Gra teraz w ${i.game}

[YFLcode-${generateString(7)}]
#YFL${i.game === "Grand Theft Auto V" ? (" #5city"):("")}`, media_ids: [mediaIdStr] }
       
            twit_updates.post('statuses/update', params, function (err, data, response) {
              console.log('Aktualizacja gry ', i.nickname)
            })
          }
        })
    })
}

export default update_game_tweet;