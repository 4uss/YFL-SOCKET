import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import {stream_info, send_tweet} from "./modules/index.js";
import {isOnline} from "./components/index.js";
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
    xkaleson: false,
    adrian1g__: false
}

app.get('/', function (req, res) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en"> 
        <head> 
            <meta charset="utf-8" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" /> 
            <title>YFLUPDATES SOCKET</title> 
            <meta property="og:type" content="website" /> 
            <link rel="icon" type="image/png" sizes="560x560" href="https://cdn.beyondlabs.pl/assets/img/logo512.png" /> 
            <style> 
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap'); 
                body{ margin: 0; padding: 0; font-family: 'Roboto', sans-serif; } 
                .bl__box{ height: 100%; width: 100%; position: absolute; text-align: left; display: grid; place-content: center; } 
                h1{ font-weight: 100; color: black !important; } 
                a{ font-weight: 100; color: #565ac6; text-decoration: none; } 
            </style> 
        </head> 
        <body class="bl__box"> 
            <div> 
                <h1>YFL UPDATES SOCKET</h1> 
                <h2>Created by <a href="https://seven7s.top/">seven7s.top</a> 
            </div> 
        </body>
    </html>`)
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
    console.log('HEROKU - Stream_analyzing')
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
    send_tweet(i)
    //console.log(i)
}


server.listen(port, () => {
    console.log(process.env.TWITCH_CLIENT_ID ? ("ENV IS WORKING"):("env is not working"), '- YFL - listening on *:3000');
});