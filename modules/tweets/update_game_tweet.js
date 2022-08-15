import {twit_updates} from "../../config/index.js";

async function update_game_tweet(i){

    //console.log(i)
    twit_updates.post('statuses/update', { status: `AKTUALIZACJA: ${i.nickname} gra teraz w ➡️ ${i.game}
https://www.twitch.tv/${i.nickname}
👤 ${i.viewer_count}
${i.title}
#YFL${i.game === "Grand Theft Auto V" ? (" #5CITY"):("")}` }, function(err, data, response) {
    //console.log(err)
        console.log("Dodano aktualizacje "+i.nickname)
    })
}

export default update_game_tweet;