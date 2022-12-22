import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fs } from 'fs';
import dotenv from "dotenv";

dotenv.config()

async function sendWhisper(to, message){
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const tokenData = JSON.parse(await fs.readFile("./tokens.json", "UTF-8"));
    const authProvider = new RefreshingAuthProvider(
		{
			clientId,
			clientSecret,
			onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
		},
		tokenData
	);
    const api = new ApiClient({authProvider});


    await api.whispers.sendWhisper("815978731", to, message)

    return ({
        status: 2000,
        message: "message sended"
    })
}
export default sendWhisper;