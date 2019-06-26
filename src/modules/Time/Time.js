const Module = require('../Module.js');

class Test extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " module load started");
  }

  makeDOM(){
    console.log("Making DOM for "  + this.getName);
    // User code here
    return `
      <section id=${this.getName}>
        ${this.makeClock()}
        ${this.makeTimer()}
      </section>
    `;
  }

  makeClock(){
    const clock = `
    <section id="Hexclock">
      <div id = "clock-wrapper">
        <h1 id = "clock"></h1>
        <h2 id = "date"></h2>
      </div>
    </section>
    `;
    return clock;
  }

  makeTimer(){
    const timer = `
    <section id="Timer">
      <div id="timer-topline">
        <!-- Increment row -->
        <button class="timer-controls" onclick="addHour()"><img src="../modules/${this.getName}/images/Chevron Up-white.png"/></button>
        <button class="timer-controls" onclick="addMinute()"><img src="../modules/${this.getName}/images/Chevron Up-white.png"/></button>
        <button class="timer-controls" onclick="addSecond()"><img src="../modules/${this.getName}/images/Chevron Up-white.png"/></button>
        <button class="timer-controls" id="reset-timer" onclick="clearCount()">Reset</button>
        <!-- Timer Face -->
        <div class="number-container">
          <!--
          number-container is our fixed height box around our number to make sure that we don't have any adverse effects
          from making enough room to scroll
         -->
          <div id="hours-invisible-scroll">
            <!-- Our actual div that scrolls. z-index sits above our hours module. br's give some space to scroll with -->
            <br/><br/><br/><br/>
          </div>
          <p id="timer-hours">00</p>
        </div>
        <div class="number-container">
          <div id="minutes-invisible-scroll">
            <br/><br/><br/><br/>
          </div>
          <p id="timer-minutes">00</p>
        </div>
        <div class="number-container">
          <div id="seconds-invisible-scroll">
            <br/><br/><br/><br/>
          </div>
          <p id="timer-seconds">00</p>
        </div>
        <button class="timer-controls" id="start-timer" onclick="beginCount()">Start</button>
        <!-- Decrement Row -->
        <button class="timer-controls" onclick="rmvHour()"><img src="../modules/${this.getName}/images/Chevron Down-white.png"/></button>
        <button class="timer-controls" onclick="rmvMinute()"><img src="../modules/${this.getName}/images/Chevron Down-white.png"/></button>
        <button class="timer-controls" onclick="rmvSecond()"><img src="../modules/${this.getName}/images/Chevron Down-white.png"/></button>
        <button class="timer-controls" id="pause-timer" onclick="pauseCount()">Pause</button>
      </div>
    </section>
    `;
    return timer
  }

  defineCSS(){//Return the file name
    console.log("Defining CSS for "  + this.getName);
    let styles = {
        local: [`${this.getName}-styles.css`, `Hexclock-styles.css`, `Timer-styles.css`],
        external: ["https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto"]
    };
    return styles;
  }

  defineScripts(){ // Returns list of all scripts + dirName + js
    // eg. ['timer.js', 'timerColor.js']
    // === ..../modules/timer/js/ + timer.js etc.
    console.log("Loading Scripts list for " + this.getName);
    let clocktype = this.config.config.clock;
    const scripts = {
      //Will be searched for in the module/js subfolder - To be run in frontent
      //Make your calls to the backend here (Still need to configure the express-server to respond)
      local: [`${clocktype}.js`, 'timer.js'],
      //Will be added in as is. ex: CDNs
      external: []
    }
    return scripts;
  }
}

module.exports = Test;
