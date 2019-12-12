class Tile {
    generateHTML(id){
            return `<div class="weather-tile">
                <canvas id="weather-right-${id}" height="50" width="50"></canvas>
                <p id="high-low-${id}"></p>
                <p></p>
            </div>`
        }
}
const skyconDict = {
    "clear-day":"CLEAR_DAY",
    "clear-night":"CLEAR_NIGHT",
    "partly-cloudy-day":"PARTLY_CLOUDY_DAY",
    "partly-cloudy-night":"PARTLY_CLOUDY_NIGHT",
    "cloudy":"CLOUDY",
    "rain":"RAIN",
    "sleet":"SLEET",
    "snow":"SNOW",
    "wind":"WIND",
    "fog":"FOG"
}
const day = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

let tileToggled = false;

function toggleTileContents(params, self){
    if(tileToggled){
        
    } else {
        // Our original
        $(self).children("p")[0].innerHTML = `${params.tempMax}&deg;C / ${params.tempMin}&deg;C`;
        
        // Setting the day
        $(self).children("p")[1].innerHTML = `${day[(params.today+count)%6]}`;
    }
    // Inverting our toggle
    tileToggled = !tileToggled;
}

$(document).ready(()=>{
    // Fetching API info
    // Generating tiles
    const skycons = new Skycons({"color": "white"});
    let tiles = ``;
    for(let i=0; i<6; i++){
        tiles += new Tile().generateHTML(i);
    }
    fetch("https://api.darksky.net/forecast/509a3e1b4a685c7dcfe210108d521b6e/42.2650,-79.8704?units=si&exclude=[minutely,flags]", {
        headers: {}
    })
    .then(response => response.json())
    .then(j => {
        console.log(j);
        let currentApparentTemp = Math.round(j.currently.apparentTemperature);
        let currentTemp = Math.round(j.currently.temperature);
        skycons.add("weather-main", Skycons[skyconDict[j.currently.icon]]);
        $("#weather-main-actual").html(`${currentTemp}&deg;C`);
        $("#weather-main-feels").html(`Feels like ${currentApparentTemp}&deg;C`);
        $("#weather-main-description").html(j.currently.summary);
        // Adding in tiles with appropriate skycon canvases
        let today = new Date().getDay();
        // Getting the appropriate division (Default to day)
        count = 0;
        $("#weather-right-side").html(tiles).children().each( function(){
            let tempMax = Math.round(j.daily.data[count].apparentTemperatureMax)
            let tempMin = Math.round(j.daily.data[count].apparentTemperatureMin)
            let id = $(this).children("canvas")[0].id;
            skycons.add(id, Skycons[skyconDict[j.daily.data[count].icon]]);
            // // Setting High/lows
            // $(this).children("p")[0].innerHTML = `${tempMax}&deg;C / ${tempMin}&deg;C`;
            // // Setting the day
            // $(this).children("p")[1].innerHTML = `${day[(today+count)%6]}`;

            setInterval(toggleTileContents({
                tempMax,
                tempMin,
                today
            }, this), 10000);
            count++;
        });
        skycons.play();
        
    });

    // Fade event -> Repurpose
    $("#fader").click( () => {
        let children = $("#weather-right-side").children();
        let time = 75;
        let fadeTime = time;
        let delayOut = time * children.length; 
        let delayIn = (time*1.75) * children.length;

        // Cool fadeout sequence
        $("#weather-right-side").children().each( function(){
            setTimeout(()=>{
                $(this).fadeOut(fadeTime*4);
            }, delayOut);   
            delayOut -= fadeTime;
        });

        // Fading back in
        setTimeout(()=>{$("#weather-right-side").children().fadeIn(350);}, delayIn)
    });
});