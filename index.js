import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import {stream_info, send_whisper} from "./modules/index.js";
import {send_tweet} from "./modules/tweets/index.js";
import fs from "fs";
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*"
    }
});
const port = process.env.PORT || 3000

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

app.set('json spaces', 2);
app.use(express.json());

app.get('/', function (req, res) {
    res.json({"message": "wss://wss.yfl.es"})
})
app.post("/send/whisper", async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    if(req.headers.id !== process.env.BOT_ID && req.headers.token !== process.env.TOKEN){
        return res.status(401).send({
            message: "Unauthorized. Invalid token!"
        });
    }
    const { to, message } = req.body;
    res.status(200).send({
        message: "Success"
    });
    await send_whisper(to, message);
});

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
    // console.log(i)
}

server.listen(port, () => {
    console.log(process.env.TWITCH_CLIENT_ID ? ("SYSTEM: env is working"):("SYSTEM: env is not working"), '- YFL - listening on *:'+port);
    yfl = JSON.parse(fs.readFileSync("crew.json", "utf8"))
});