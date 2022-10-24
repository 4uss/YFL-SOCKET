import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import {stream_info} from "./modules/index.js";
import {send_tweet, update_emotes_tweet} from "./modules/tweets/index.js";
import EventSource from "eventsource";
import fs from "fs";
import runTwitch from './Twitch/runTwitch.js';
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*"
    }
});
const port = process.env.PORT || 3000
const source = new EventSource("https://events.7tv.app/v1/channel-emotes?channel=xmerghani,mork,mrdzinold,banduracartel,youngmulti,xkaleson");

/* Listening to an event source. */
source.addEventListener(
  "update",
  (e) => {
    const data = JSON.parse(e.data);
    update_emotes_tweet({
        emote_name: data.name,
        emote_id: data.emote_id,
        channel: data.channel,
        action: data.action
    })
  },
  false
);

source.addEventListener(
  "error",
  (e) => {
    if (e.readyState === EventSource.CLOSED) {
        console.log(e)
      // Connection was closed.
    }
  },
  false
);

//runTwitch()

/* 
    false = Stream is Offline
    true = Stream is Online
*/
let yfl = {
    youngmulti: false,
    xmerghani: false,
    mrdzinold: false,
    banduracartel: false,
    mork: false,
    xspeedyq: false,
    xkaleson: false,
    adrian1g__: false,
    youngmulti_game: 'Just Chatting',
    xmerghani_game: 'Just Chatting',
    mrdzinold_game: 'Just Chatting',
    banduracartel_game: 'Just Chatting',
    xkaleson_game: 'Just Chatting',
    mork_game: 'Just Chatting'
}

app.get('/', function (req, res) {
    res.json({"message": "wss://wss.yfl.es"})
})

io.on('connection', (socket) => {
    //console.log('a user connected');
    
    socket.emit('channels', yfl);

    socket.on('refresh channels', (data) => {
        socket.emit('channels', yfl);
    });

    socket.on('disconnect', () => {
        //console.log('user disconnected');
    });
});

setInterval(() => {
    stream_analyzing(yfl)
}, 60 * 1000);

async function stream_analyzing(crew){
    const streams = await stream_info(crew);

    if(streams.error) return;

    yfl = streams.channels;

    if (streams.list.length === 0) return;

    streams.list.map(function(x) {
        sendNoti({
            nickname: x.nickname,
            title: x.title,
            thumbnail: x.thumbnail
        })
    });
}

function sendNoti(i){
    io.sockets.emit('live notification', i);

    if(i.nickname.toLowerCase() === "xspeedyq" || i.nickname.toLowerCase() === "adrian1g__") return;

    send_tweet(i)
    //console.log(i)
}

server.listen(port, () => {
    console.log(process.env.TWITCH_CLIENT_ID ? ("SYSTEM: env is working"):("SYSTEM: env is not working"), '- YFL - listening on *:'+port);
    yfl = JSON.parse(fs.readFileSync("crew.json", "utf8"))
});