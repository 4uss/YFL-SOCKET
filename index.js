import express from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import {stream_info, send_tweet} from "./modules/index.js";
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
    youngmulti_game: 'Just Chatting',
    xmerghani: false,
    xmerghani_game: 'Just Chatting',
    mrdzinold: false,
    mrdzinold_game: 'Just Chatting',
    banduracartel: false,
    banduracartel_game: 'Just Chatting',
    mork: false,
    mork_game: 'Just Chatting',
    xspeedyq: false,
    xkaleson: false,
    adrian1g__: false
}

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

app.get('/', function (req, res) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en"> 
        <head> 
            <meta charset="utf-8" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" /> 
            <title>YFL UPDATES SOCKET</title> 
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

    if(i.nickname.toLowerCase() === "xspeedyq" || i.nickname.toLowerCase() === "xkaleson" || i.nickname.toLowerCase() === "adrian1g__") return;

    send_tweet(i)
    //console.log(i)
}
function shutdown(signal) {
  return (err) => {
    console.log(`${ signal }...`);
    if (err) console.error(err.stack || err);

    fs.writeFile("crew.json", JSON.stringify(yfl), (err) => {
        if (err)
          console.log(err);
        else {
          console.log("Saved channels");
        }
    });

    setTimeout(() => {
      console.log('...waited 5s, exiting.');
      process.exit(err ? 1 : 0);
    }, 5000).unref();
  };
}
server.listen(port, () => {
    console.log(process.env.TWITCH_CLIENT_ID ? ("ENV IS WORKING"):("env is not working"), '- YFL - listening on *:3000');
    yfl = JSON.parse(fs.readFileSync("crew.json", "utf8"))
});
