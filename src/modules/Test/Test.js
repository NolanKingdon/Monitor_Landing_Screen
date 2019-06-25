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
        <h1 id="Test-test">This is written in a JavaScript Class</h1>
        <p>It is loaded by a parser when queried by the moduleHandler</p>
        <p>The module handler is triggered by a script in the main html file</p>
      </section>
    `;
  }

  defineCSS(){//Return the file name
    console.log("Defining CSS for "  + this.getName);
    return "Test-styles.css";
  }

  defineScripts(){ // Returns list of all scripts + dirName + js
    // eg. ['timer.js', 'timerColor.js']
    // === ..../modules/timer/js/ + timer.js etc.
    console.log("Loading Scripts list for " + this.getName);
    const scripts = {
      //Will be searched for in the module/js subfolder - To be run in frontent
      //Make your calls to the backend here (Still need to configure the express-server to respond)
      local: ["test.js"],
      //Will be added in as is. ex: CDNs
      external: []
    }
    return scripts;
  }
}

module.exports = Test;
