import axios from "axios";
import dotenv from "dotenv";
import update_token from "./update_token.js";
dotenv.config()

let access_token = "933f8w8bwhi9ynejxkk9631rp3pspv";


const stream_info = async () => {
    const options = {
        headers: {
          'Authorization': 'Bearer '+access_token,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
    };

    try {
        const resp = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${process.env.YOUNGMULTI_ID}&user_id=${process.env.XMERGHANI_ID}&user_id=${process.env.MRDZINOLD_ID}&user_id=${process.env.BANDURACARTEL_ID}&user_id=${process.env.MORK_ID}&user_id=${process.env.XKALESON_ID}&user_id=${process.env.ADRIAN1G_ID}`, options)
        const twitch_data = resp.data.data;

        return twitch_data;

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