const Module = require('../Module.js');

class Youtube extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " module load started");
  }

  makeDOM(){
    console.log("Making DOM for "  + this.getName);
    // User code here
    return `
      <section id=${this.getName}>
      <div id="player"></div>
      <!-- TODO Switch to CSS marquee for more control -->
      <marquee id="yt-title-scroll">Test text</marquee>
      <div id="yt-control-flex">
        <button id="yt-play-toggle" class="btn" onclick="togglePlaying()">Play</button>
        <button id="yt-skip" class="btn" onclick="nextVid()">Next</button>
        <input  id="yt-input" class="input" type = "text"/>
        <button id="yt-submit" class="btn">Submit</button>
        <button id="yt-options" class="btn">...</button>

      </div>
      <div id="yt-search-results">

      </div>
      <div id="yt-missed-video-debug">
        <ul id="yt-missed-list"></ul>
      </div>

      </section>
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
      local: [`createIFrame.js`, `youtubePlayer.js`],
      //Will be added in as is. ex: CDNs
      external: [`https://apis.google.com/js/api.js`]
    }
    return scripts;
  }
}

module.exports = Youtube;
