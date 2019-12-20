const Module = require('../Module.js');

//Keep it modular - any time you have a big block of html, make a function for it so you can really break it down
//Reference these files if you want to make a new window or something similar

class CMD extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " module load started");
  }

  makeDOM(){
    console.log("Making DOM for "  + this.getName);
    // User code here
    return `
      <section id=${this.getName}>
        <div id="console-window">
          <div id="console-inputbar">
          <p id="console-directory">C:\\Users\\Nolan></p>
          <input type="text" id="console-input"></input>
          </div>
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
      local: ["cmd.js"],
      //Will be added in as is. ex: CDNs
      external: []
    }
    return scripts;
  }
}

module.exports = CMD;
