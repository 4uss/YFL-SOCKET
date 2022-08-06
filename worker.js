const socket = io('https://ws-yfl.seven7s.top');
let liveNumber = 0;

if(!localStorage.youngmulti){ localStorage.youngmulti = true};
if(!localStorage.xmerghani){ localStorage.xmerghani = true};
if(!localStorage.mrdzinold){ localStorage.mrdzinold = true};
if(!localStorage.banduracartel){ localStorage.banduracartel = true};
if(!localStorage.mork){ localStorage.mork = true};
if(!localStorage.xkaleson){ localStorage.xkaleson = true};
if(!localStorage.adrian1g__){ localStorage.adrian1g__ = true};
if(!localStorage.welcomeMessage){ localStorage.welcomeMessage = false};

if(!localStorage.status_settings){ localStorage.status_settings = true};
if(!localStorage.audio_settings){ localStorage.audio_settings = false};
if(!localStorage.audio_url){ localStorage.audio_url = JSON.stringify({"name":"Domyślny","url":"https://cdn.beyondlabs.pl/XI/alarms/default.mp3"})};
if(!localStorage.audio_range){ localStorage.audio_range = "0.50"};

socket.on('channels', function(data) {

    let temp = 0;
    for (var key in data) {
        if(data[key] === true){
            ++temp
        }
    }
    liveNumber = temp;
    streamsLive()
});

socket.on('live notification', function(data) {
    if(localStorage.status_settings === false) return;

    if(localStorage[data.nickname.toLowerCase()] === 'true') return streamLive(data);
});

setInterval(() => {
    socket.emit('refresh channels');
}, 60 * 1000);

function streamLive(data){
    chrome.notifications.create({ 
        type: "image",
        title: `${data.nickname} odpalił stream VisLaud`, 
        message: data.title, 
        iconUrl: chrome.runtime.getURL("icons/512.png"),
        imageUrl: data.thumbnail

    }, 
    function () {
        console.log(chrome.runtime.lastError);
    });
    /*chrome.notifications.onClicked.addListener(
        chrome.tabs.create({url:"https://twitch.tv/"+data.nickname})
    )*/
    if(JSON.parse(localStorage.audio_settings) === true){
        document.querySelector("#radio").volume = localStorage.audio_range;

        document.querySelector('#radio').src = JSON.parse(localStorage.audio_url).url;
        document.querySelector("#radio").play();
    }
}

function streamsLive(){
    if(liveNumber === 0){
        chrome.browserAction.setBadgeBackgroundColor({ color: "#b30b2f" })
        chrome.browserAction.setBadgeText({ text: "0" })
    }else{
        chrome.browserAction.setBadgeBackgroundColor({ color: "#6f42c1" })
        chrome.browserAction.setBadgeText({ text: `${liveNumber}` })
    }
}
if (JSON.parse(localStorage.welcomeMessage) === false) {
    chrome.notifications.create({ 
        message: "Dzięki za zainstalowanie dodatku YFL Updates. Będziesz na bieżąco informowany o każdym streamie.", 
        contextMessage: "Możesz to zmienić klikając lewym przyciskiem na ikone dodatku.", 
        title: "Witaj w YFL Updates", 
        type: "basic", 
        iconUrl: chrome.runtime.getURL("icons/512.png")
    }, 
    function () {
        console.log(chrome.runtime.lastError);
    });
    localStorage.welcomeMessage = true;
}