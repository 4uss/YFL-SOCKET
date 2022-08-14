import axios from "axios";

function update_token(){
    const options = {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    };

    const reuqest = axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)
    .then((response) => {
        return (response.data);
    }, (error) => {
        console.log(error)
        return {
            error: "error"
        }
    });

    return reuqest;
}

export default update_token;