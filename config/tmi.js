import tmi from "tmi.js";

const opts = {
    identity: {
        username: 'YFLUpdates',
        password: 'oauth:whq641h6k28zr714natv58m1djraah'
    },
    channels: [
        'banduracartel',
        'mork',
        'mrdzinold',
        'xmerghani',
        'youngmulti',
        '3xanax'
    ],
    connection: {
        reconnect: true // This
    }
};
const client = new tmi.client(opts);

client.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect();
// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
export default client;