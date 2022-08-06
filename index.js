import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import {stream_info} from "./modules/index.js";
import {isOnline} from "./components/index.js";
dotenv.config()

const app = express;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

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
    xkaleson: false,
    adrian1g__: false
}

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.emit('channels', yfl);

    socket.on('refresh channels', (data) => {
        socket.emit('channels', yfl);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

setInterval(() => {
    stream_analyzing(yfl)
}, 60 * 1000);

async function stream_analyzing(crew){
    yfl = {
        youngmulti: false,
        xmerghani: false,
        mrdzinold: false,
        banduracartel: false,
        mork: false,
        xkaleson: false,
        adrian1g__: false  
    }
    const streams = await stream_info();

    streams.map(function(x) {
        const isData = isOnline(x, crew);
        if(isData.status === 777){
            sendNoti({
                nickname: x.user_name,
                title: x.title,
                thumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${x.user_login}-1920x1080.jpg`
            })
            yfl[isData.json_name] = true;
        }else if(isData.status === 1337){
            yfl[isData.json_name] = true;
        }
    });
}

function sendNoti(i){
    io.sockets.emit('live notification', i);
    //console.log(i)
}


server.listen(3000, () => {
    console.log(process.env.TWITCH_CLIENT_ID, 'YFL - listening on *:3000');
});
