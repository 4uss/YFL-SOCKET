import axios from "axios";
import dotenv from "dotenv";
import update_token from "./update_token.js";
import {isOnline} from "../components/index.js";
import update_tweet from "./update_tweet.js";

dotenv.config()

let access_token = "933f8w8bwhi9ynejxkk9631rp3pspv";


const stream_info = async (currentChannels) => {
    const options = {
        headers: {
          'Authorization': 'Bearer '+access_token,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
    };
    let channels = {
        youngmulti: false,
        youngmulti_game: 'Just Chatting',
        xmerghani: false,
        xmerghani_game: 'Just Chatting',
        mrdzinold: false,
        mrdzinold_game: 'Just Chatting',
        banduracartel: false,
        banduracartel_game: 'Just Chatting',
        mork: false,
        mork_game: 'Just Chatting',
        xspeedyq: false,
        xkaleson: false,
        adrian1g__: false  
    }
    let noti_list = [];

    try {
        const resp = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${process.env.YOUNGMULTI_ID}&user_id=${process.env.XMERGHANI_ID}&user_id=${process.env.MRDZINOLD_ID}&user_id=${process.env.BANDURACARTEL_ID}&user_id=${process.env.MORK_ID}&user_id=${process.env.XKALESON_ID}&user_id=${process.env.ADRIAN1G_ID}&user_id=${process.env.XSPEEDYQ_ID}`, options)
        const twitch_data = resp.data.data;

        twitch_data.map(function(x) {
            const isData = isOnline(x, currentChannels);
            if(isData.status === 777){
                noti_list.push({
                        nickname: x.user_name,
                        title: x.title,
                        thumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${x.user_login}-1920x1080.jpg`
                })
                channels[isData.json_name] = true;

                /* Checking if the user name is equal to xspeedyq, xkaleson, or adrian1g__. If it is, it returns. If it
                is not, it sets the game name to the game name. */
                if(x.user_name.toLowerCase() === "xspeedyq" || x.user_name.toLowerCase() === "xkaleson" || x.user_name.toLowerCase() === "adrian1g__") return;

                channels[isData.json_name+"_game"] = x.game_name;

            }else if(isData.status === 1337){
                channels[isData.json_name] = true;
                
                /* Checking if the user name is equal to xspeedyq, xkaleson, or adrian1g__. If it is, it returns. If it
                is not, it sets the game name to the game name. */
                if(x.user_name.toLowerCase() === "xspeedyq" || x.user_name.toLowerCase() === "xkaleson" || x.user_name.toLowerCase() === "adrian1g__") return;

                if(currentChannels[isData.json_name+"_game"] !== x.game_name){
                    update_tweet({
                        nickname: x.user_name,
                        title: x.title,
                        game: x.game_name
                    })

                    channels[isData.json_name+"_game"] = x.game_name;
                }
            }
        });

        return {
            channels: channels,
            list: noti_list
        };


    } catch (err) {
        if(err.response.data.status === 401 && err.response.data.error === "Unauthorized"){
            const token = await update_token();

            if(token.error) return;

            access_token = token.access_token;

            return {
                error: "Token Update",
                message: "Access token is old, updated!"
            };
        }

        console.error(err.response.data);
        return {
            error: "error",
            message: "Something went wrong!"
        }
    }
}

export default stream_info;