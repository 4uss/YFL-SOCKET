import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { insertToDatabase } from "../components/index.js";
import { send_ban_tweet } from "../modules/tweets/index.js"
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function Main() {
	const clientId = process.env.TWITCH_CLIENT_ID;
	const clientSecret = process.env.TWITCH_CLIENT_SECRET;
	const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
	const authProvider = new RefreshingAuthProvider(
		{
			clientId,
			clientSecret,
			onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
		},
		tokenData
	);
	const api = new ApiClient({authProvider});
	const chatClient = new ChatClient({ authProvider, channels: ["banduracartel", "mork", "mrdzinold", "xmerghani", "youngmulti", "xspeedyq", "xkaleson", "adrian1g__", "3xanax"]});
	await chatClient.connect();

	async function callClip(channelID){
		const call = await api.clips.createClip({ channelId: channelID }).catch(error => {
			return null;
		})

		return call;
	}
    chatClient.onBan(async (channel, user, msg) => {
		const userID = await api.users.getUserByName(channel.replaceAll("#", ""));
		const createClip = await callClip(userID?.id);

		insertToDatabase("bans" , {
			user: user,
			channel: channel,
			action: 'ban',
			clip: createClip ? (createClip):(null)
		})

		if(channel === "#youngmulti" || channel === "#xmerghani" || channel === "#mrdzinold" || channel === "#banduracartel" || channel === "#mork" || channel === "#3xanax") {
			send_ban_tweet(channel, user)
		}
    })

	chatClient.onTimeout((channel, user, duration, msg) => {

		insertToDatabase("bans" , {
			user: user,
			channel: channel,
			action: 'timeout',
			duration: duration
		})
    })
}
export default Main;