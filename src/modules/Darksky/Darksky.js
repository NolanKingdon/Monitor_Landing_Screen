const Module = require('../Module.js');

class Launchpad extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " module load started");
  }

  makeDOM(){
    console.log("Making DOM for "  + this.getName);
    // User code here
    return `
    <div id="weather-container">
      <div id="weather-topbar">
          <button><img src="" alt=""></button>
      </div>
      <div id="weather-sides">
          <div id="weather-left-side">
              <canvas id="weather-main" height="110" width="110"></canvas>
              <h3 class="weather-text" id="weather-main-actual"></h3>
              <h4 class="weather-text" id="weather-main-feels"></h4>
              <h4 class="weather-text" id="weather-main-description"></h4>
          </div>
          <div id="weather-right-side">
          </div>
      </div>
      <div id="weather-botbar"></div>
    </div>
    `;
  }

  defineCSS(){//Return the file name
    console.log("Defining CSS for "  + this.getName);
    let styles = {
        local: [`${this.getName}-styles.css`],
        external: []
    };
    return styles;
  }

  defineScripts(){ // Returns list of all scripts + dirName + js
    // eg. ['timer.js', 'timerColor.js']
    // === ..../modules/timer/js/ + timer.js etc.
    console.log("Loading Scripts list for " + this.getName);
    const scripts = {
      //Will be searched for in the module/js subfolder - To be run in frontent
      //Make your calls to the backend here (Still need to configure the express-server to respond)
      local: ["darksky.js", "skycons.js"],
      //Will be added in as is. ex: CDNs
      external: []
    }
    return scripts;
  }
}

module.exports = Launchpad;
