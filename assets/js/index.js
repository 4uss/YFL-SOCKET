const socket = io.connect('https://ws-yfl.seven7s.top');
const button_off = `.yfl__switch span[bb-type="button__off"]`;
const button_on = `.yfl__switch span[bb-type="button__on"]`;

socket.emit('refresh channels');

socket.on('channels', function(data) {

    for (var key in data) {
        if(data[key] === true){
            sortChannels(data[key], key)
        }
        buttonGenerator(key)
        checkChannelsStatus(key)
    }
});

function sortChannels(STATUS, NAME){
    if(STATUS === true) return document.querySelector(`#${NAME}`).classList.add('yfl__im__live');
}

fetch('https://api.4uss.cyou/alarms.php')
  .then(response => response.json())
  .then(data => data.map((item, i) => api(item)));

/**
 * It takes a JSON object as an argument, creates a new option element, sets the text of the option to
 * the name property of the JSON object, and sets the value of the option to the JSON object itself.
 * @param data - the data object that you want to add to the select
 */
function api(data) {
    var x = document.querySelector('.bb__select');
    var option = document.createElement("option");
    option.text = data.name;
    option.value = JSON.stringify(data);
    x.add(option);
}

/**
 * It creates a new option element, sets the text to the name of the selected API, sets the value to
 * the JSON string of the selected API, sets the option to selected, and disables it
 * @param data - The data returned from the server, formatted according to the dataType parameter or
 * the dataFilter callback function, if specified.
 */
 function apiSelected(data) {
    var x = document.querySelector('.bb__select');
    var option = document.createElement("option");
    option.text = JSON.parse(data).name+' - Wybrany';
    option.selected = true;
    option.disabled = true;
    option.value = data;
    x.add(option);
}

document.querySelector('.bb__select').addEventListener('input', (event) => {
    document.querySelector('.bb__current__alarm').innerText = JSON.parse(event.target.value).name;
    localStorage.audio_url = event.target.value;
});

document.querySelector('.bb__range').addEventListener('change', (event) => {
    localStorage.audio_range = event.target.value;
});

apiSelected(localStorage.audio_url)
/* It's setting the text of the element with the class `bb__current__alarm` to the name of the audio
file that is stored in localStorage. */
document.querySelector('.bb__current__alarm').innerText = JSON.parse(localStorage.audio_url).name;
document.querySelector('.bb__range').value = localStorage.audio_range;

/**
 * If the localStorage item exists, then if it's true, set the off button to inactive and the on button
 * to active, otherwise, set the off button to active and the on button to inactive.
 * @param name - the name of the channel
 */
function checkChannelsStatus(name){
    var buttonOff = document.querySelector(`#${name} ${button_off}`);
    var buttonOn = document.querySelector(`#${name} ${button_on}`);
    if (localStorage.getItem(name)) {
        if(localStorage.getItem(name) === "true"){
            buttonOff.className = "yfl__buton";
            buttonOn.className = "yfl__buton_active";
        }else{
            buttonOff.className = "yfl__buton_active";
            buttonOn.className = "yfl__buton";
        }
    }
}

/**
 * It adds an event listener to each button that changes the class of the button that was clicked and
 * the other button.
 * @param key - the name of the localStorage item
 */
function buttonGenerator(key){
    document.querySelector(`#${key} ${button_off}`).addEventListener("click", function() {
        localStorage[key] = false;
        document.querySelector(`#${key} ${button_off}`).className = "yfl__buton_active";
        document.querySelector(`#${key} ${button_on}`).className = "yfl__buton";
    });
    document.querySelector(`#${key} ${button_on}`).addEventListener("click", function() {
        localStorage[key] = true;
        document.querySelector(`#${key} ${button_on}`).className = "yfl__buton_active";
        document.querySelector(`#${key} ${button_off}`).className = "yfl__buton";
    });
}

document.querySelector(`.alerts ${button_off}`).addEventListener("click", function() {
    localStorage.status_settings = false;
    document.querySelector(`.alerts ${button_off}`).className = "yfl__buton_active";
    document.querySelector(`.alerts ${button_on}`).className = "yfl__buton";
});
document.querySelector(`.alerts ${button_on}`).addEventListener("click", function() {
    localStorage.status_settings = true;
    document.querySelector(`.alerts ${button_on}`).className = "yfl__buton_active";
    document.querySelector(`.alerts ${button_off}`).className = "yfl__buton";
});

document.querySelector(`.alerts__audio ${button_off}`).addEventListener("click", function() {
    localStorage.audio_settings = false;
    document.querySelector(`.alerts__audio ${button_off}`).className = "yfl__buton_active";
    document.querySelector(`.alerts__audio ${button_on}`).className = "yfl__buton";
});
document.querySelector(`.alerts__audio ${button_on}`).addEventListener("click", function() {
    localStorage.audio_settings = true;
    document.querySelector(`.alerts__audio ${button_on}`).className = "yfl__buton_active";
    document.querySelector(`.alerts__audio ${button_off}`).className = "yfl__buton";
});