
class Tile {
    generateHTML(id){
            return `<div class="weather-tile">
            <canvas id="weather-right-${id}" height="50" width="50"></canvas>
            <p id="weather-second"></p>
            <p class="winds" id="high-low-${id}"></p>
            </div>`
        }
}

class DarkSky {

    constructor(){
        this.tiles = ``;
        for(let i=0; i<6; i++){
            this.tiles += new Tile().generateHTML(i);
        }

        // Starting out by looking at all the days of the week
        this.weekview = true;
        this.skyconDict = {
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
        this.day = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        }
        this.createSkycons();
        this.recentCall = this.getAPIData();

        $("#weather-toggle").click( () => {
            this.toggleView();
        });

        $("#weather-refresh").click( () => {
            this.update();
        })
    }

    update(){
        let update = new Promise( (res, rej) => {
            fetch("https://api.darksky.net/forecast/509a3e1b4a685c7dcfe210108d521b6e/42.2650,-79.8704?units=si&exclude=[minutely,flags]", {
            headers: {}
        }).then(response => response.json())
        .then(j => res(j));
        });

        update.then( json => {
            let fadeTime = 125;
            let fadeInTime = this.fadeOutElements(fadeTime);
            setTimeout( () => {this.updateDOM(json, fadeInTime);}, fadeTime * 10);
        })
    }

    updateDOM(json, fadeInTime){
        let self = this;
        // Resetting the skycon list
        this.skycons.list = [];
        // Unsetting any interval nonsense
        clearInterval(this.interval);

        // Getting info from JSON
        let currentApparentTemp = Math.round(json.currently.apparentTemperature);
        let currentTemp = Math.round(json.currently.temperature);
        // re-adding the main, now updated skycon
        this.skycons.add("weather-main", Skycons[this.skyconDict[json.currently.icon]]);
        $("#weather-main-actual").html(`${currentApparentTemp}&deg;C`);
        $("#weather-main-feels").html(`(${currentTemp}&deg;C)`);
        $("#weather-main-description").html(json.currently.summary);

        // Updating the description paragraph
        if(this.weekview){
            $("#weather-description").html(json.daily.summary);
        } else {
            $("#weather-description").html(json.hourly.summary);
        }

        // Adding in tiles with appropriate skycon canvases
        let today = new Date().getDay();
        // Getting the appropriate division (Default to day)
        let count = 0; // used for listener assignment, fade out times, and weekday tracking
        let hour = 0; // Used exclusively to track the hour we look at in the hours view
        $("#weather-right-side").html(this.tiles).children().each( function(){
            if(self.weekview){
                let tempMax = Math.round(json.daily.data[count].apparentTemperatureMax);
                let tempMin = Math.round(json.daily.data[count].apparentTemperatureMin);
                let precipChance = json.daily.data[count].precipProbability;
                let windSpeed = Math.round(json.daily.data[count].windSpeed);
                let windDirection = json.daily.data[count].windBearing;
    
                let id = $(this).children("canvas")[0].id;
                self.skycons.add(id, Skycons[self.skyconDict[json.daily.data[count].icon]]);
    
                let firstP = $(this).children("p")[0];
                let secondP = $(this).children("p")[1];        
    
                let currentC = count;
                // Setting the interval
                this.interval = setInterval(()=>self.toggleTileContents({
                    tempMax,
                    tempMin,
                    precipChance,
                    windSpeed,
                    windDirection,
                    today,
                    currentC,
                    hour
                }, this), 10000);
                count++;
                $(firstP).html(`${json.daily.data[count].temperatureMax}&deg;C to ${json.daily.data[count].temperatureMin}&deg;C`);
                $(secondP).html(`${self.day[(new Date().getDay()+count)%6]}`);
                firstP.className = "temps";
            } else {
                let tempMax = Math.round(json.hourly.data[hour].apparentTemperature);
                let tempMin = Math.round(json.hourly.data[hour].temperature);
                let precipChance = json.hourly.data[hour].precipProbability;
                let windSpeed = Math.round(json.hourly.data[hour].windSpeed);
                let windDirection = json.hourly.data[hour].windBearing;
    
                let id = $(this).children("canvas")[0].id;
                self.skycons.add(id, Skycons[self.skyconDict[json.hourly.data[hour].icon]]);
    
                let firstP = $(this).children("p")[0];
                let secondP = $(this).children("p")[1];        
    
                let currentC = hour;
                // Setting the interval
                this.interval = setInterval(()=>self.toggleTileContents({
                    tempMax,
                    tempMin,
                    precipChance,
                    windSpeed,
                    windDirection,
                    today,
                    currentC,
                    hour
                }, this), 10000);
                count++;
                hour += 4; // 24 hours / 6 (num of tiles) equal intervals of 4
                $(firstP).html(`${Math.round(json.hourly.data[hour].apparentTemperature)}&deg;C\n(${Math.round(json.hourly.data[hour].temperature)}&deg;C)`);
                $(secondP).html(`${(new Date().getHours()+hour)%24}:00h`);
                firstP.className = "temps";
            }
            self.fadeInElements(fadeInTime);
        });

    }

    fadeOutElements(time){
        let children = $("#weather-right-side").children();
        // let time = 75;
        let fadeTime = time;
        // Adding in +1 to children length to account for the main icon on the left side
        let delayOut = time * (children.length + 1); 
        let delayIn = (time*1.75) * (children.length + 1);
        
        // Fadeout for main tile -> Want the fade effect to be bottom right to top left
        setTimeout(() => {
            $("#weather-left-side").fadeOut(fadeTime*4);
            // The paragraph fades out with the left side
            $("#weather-description").fadeOut(fadeTime*4);
        }, delayOut);
        delayOut -= fadeTime;        
        // Cool fadeout sequence for the tiles
        $("#weather-right-side").children().each( function(){
            setTimeout(()=>{
                $(this).fadeOut(fadeTime*4);
            }, delayOut);   
            delayOut -= fadeTime;
        });
        return delayIn;
    }
    
    fadeInElements(delayIn){
        // Fading back in
        $("#weather-left-side").fadeIn(350);
        $("#weather-description").fadeIn(350);
        $("#weather-right-side").children().fadeIn(350);
    }

    createSkycons(){
        this.skycons = new Skycons({"color": "white"});
    }

    getAPIData(){
        let json;
        let skycons = this.skycons;
        let skyconDict = this.skyconDict;
        let self = this;
        fetch("https://api.darksky.net/forecast/509a3e1b4a685c7dcfe210108d521b6e/42.2650,-79.8704?units=si&exclude=[minutely,flags]", {
            headers: {}
        })
        .then(response => response.json())
        .then(j => {
            // Current Temperature
            let currentApparentTemp = Math.round(j.currently.apparentTemperature);
            let currentTemp = Math.round(j.currently.temperature);
            this.skycons.add("weather-main", Skycons[this.skyconDict[j.currently.icon]]);
            $("#weather-main-actual").html(`${currentApparentTemp}&deg;C `);
            $("#weather-main-feels").html(`(${currentTemp}&deg;C)`);
            $("#weather-main-description").html(j.currently.summary);
            // Description Paragraph
            if(this.weekview){
                $("#weather-description").html(j.daily.summary);
            } else {
                $("#weather-description").html(j.hourly.summary);
            }
            // Adding in tiles with appropriate skycon canvases
            let today = new Date().getDay();
            // Getting the appropriate division (Default to day)
            let count = 1;
            let hour = 0;
            // Future forcast 
            $("#weather-right-side").html(this.tiles).children().each( function(){
                // This is the issue -> Adjust for weekly/daily view here too
                let tempMax = (this.weekview ? Math.round(j.daily.data[count].apparentTemperatureMax) : Math.round(j.hourly.data[hour].apparentTemperature));
                let tempMin = (this.weekview ? Math.round(j.daily.data[count].apparentTemperatureMin) : Math.round(j.hourly.data[hour].temperature));
                let precipChance = Math.round(j.daily.data[count].precipProbability);
                let windSpeed = Math.round(j.daily.data[count].windSpeed);
                let windDirection = j.daily.data[count].windBearing;

                let id = $(this).children("canvas")[0].id;
                skycons.add(id, Skycons[skyconDict[j.daily.data[count].icon]]);
                
                let currentC = count;
                // First fire
                self.toggleTileContents({
                    tempMax,
                    tempMin,
                    precipChance,
                    windSpeed,
                    windDirection,
                    today,
                    currentC,
                    hour
                }, this);

                // Setting the interval
                this.interval = setInterval(()=>self.toggleTileContents({
                    tempMax,
                    tempMin,
                    precipChance,
                    windSpeed,
                    windDirection,
                    today,
                    currentC,
                    hour
                }, this), 10000);
                count++;
                hour += 4;
            });
            skycons.play();
            json = j;
        });
        return json;
    }

    toggleTileContents(params, self){
        let firstP = $(self).children("p")[0];
        let secondP = $(self).children("p")[1];
        if(firstP.className === "winds"){
            // Our original
            $(firstP).fadeOut(400);
            $(secondP).fadeOut(400);
            setTimeout( () => {
                $(firstP).html(`${params.tempMax}&deg;C to ${params.tempMin}&deg;C`);
                if(this.weekview){
                    $(secondP).html(`${this.day[(params.today+params.currentC)%6]}`);
                } else {
                    $(secondP).html(`${(new Date().getHours()+params.hour)%24}:00h`);
                }
            }, 500);
            firstP.className = "temps";
            $(firstP).fadeIn();
            $(secondP).fadeIn();
            // Setting the day
        } else {
            let charDirection = this.calcWindDirection(params.windDirection);

            $(firstP).fadeOut(400);
            $(secondP).fadeOut(400);
            setTimeout( () => {
                // If we're looking at the week, not the hours
                $(firstP).html(`${params.windSpeed}Km/h ${charDirection}`);
                firstP.className = "winds";
                $(secondP).html(`${params.precipChance*100}% Rain`);
                
            }, 500);
            firstP.className = "temps";
            $(firstP).fadeIn();
            $(secondP).fadeIn();
        }
    }

    /**
     *  Returns a letter value for the direction of the wind. 
     * 
     *  TODO - Add in more specificity: SSW, SWW, NNW, etc.
     * @param {int} degrees - 0/360 is north. Degree angle of the wind
     */
    calcWindDirection(degrees){
        let letterDir = ""
        // First one has to be an or, because something cant be > 300 AND < 45
        if(degrees > 300 || degrees < 45 ){
            letterDir = "N";
        } else if(degrees === 45){
            letterDir = "NE";
        } else if(degrees > 45 && degrees < 135){
            letterDir = "E";
        } else if(degrees === 135){
            letterDir = "SE";
        } else if(degrees > 135 && degrees < 225){
            letterDir = "S";
        } else if(degrees === 225){
            letterDir = "SW";
        } else if( degrees > 225 && degrees < 300){
            letterDir = "E";
        } else if ( degrees === 300){
            letterDir = "NW";
        }
        return letterDir   
    }

    toggleView(){
        if(!this.weekview){
            $("#weather-toggle").children("img").attr("src","../modules/Darksky/images/hourview.png");
        } else {
            $("#weather-toggle").children("img").attr("src","../modules/Darksky/images/weekview.png");
        }
        this.weekview = !this.weekview;
        this.update();
    }
}


$(document).ready(()=>{
    const darkSky = new DarkSky();
    setInterval(()=>{
        darkSky.update();
        // 15 minute interval by default -> Change in config potentially
    }, 900000);
    // Fetching API info
    // Generating tiles
});