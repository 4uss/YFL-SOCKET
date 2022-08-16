import tmi from "tmi.js";

const opts = {
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_PASSWORD
    },
    channels: [
        'banduracartel',
        'mork',
        'mrdzinold',
        'xmerghani',
        'youngmulti',
        'xspeedyq',
        'xkaleson',
        'adrian1g__',
        '3xanax',
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