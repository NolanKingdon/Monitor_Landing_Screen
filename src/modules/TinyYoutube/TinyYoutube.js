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
      <div id="yt-control-flex">
        <button id="yt-play-toggle" class="btn" onclick="togglePlaying()">Play</button>
        <button id="yt-skip" class="btn" onclick="nextVid()">Next</button>
        <select id="yt-playlists" class="input" type = "text">
          <option value="lofiS">LoFi Stream</option>
          <option value="upbeatP">Upbeat Playlist</option>
          <option value="tranceP">Trance Playlist</option>
          <option value="tranceS">Trance Stream</option>
          <option value="relaxedP">Relaxed Playlist</option>
        </select>
        <input type="range" min="0" max="100" value="50" id="yt-volume-slider" onchange="updateVolume(this.value)">
      </div>
        <div id="yt-video-info">
          <p id="yt-now-playing">
            Now Playing:
          </p>
          <p id="yt-video-title"></p>
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
