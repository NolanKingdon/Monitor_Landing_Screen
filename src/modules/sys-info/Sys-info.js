const Module = require('../Module.js');

class SysInfo extends Module {

  constructor(config){
    super(config);
    // console.log(this.config.name + " module load started");
  }

  makeDOM(){
    // console.log("Making DOM for "  + this.getName);
    // User code here
    return `
      <section id=${this.getName}>
        <div id="sys-info-body">
          <h2 id="sys-header">System Information</h2>
          ${this.makeCPUSection()}
          ${this.makeRAMSection()}
          ${this.makeDisplaySection()}
        </div>
        <script src="../modules/Sys-info/js/comp-data.js"></script>
      </section>
    `;
  }

  makeCPUSection(){
    let section = `
      <p id="sys-cpu-head" class="sys-title-col">CPU:</p>
      <p id="sys-cpu-info" class="sys-data-col"></p>
      <p id="processor-speed" class="sys-data-col"></p>
      <canvas id="cpu-graph" width="450"></canvas>
    `;
    return section;
  }

  makeRAMSection(){
    let section = `
      <p id="sys-ram-head" class="sys-title-col">RAM:</p>
      <p id="sys-ram-info" class="sys-data-col"></p>
      <p id="ram-percent" class="sys-data-col"></p>
      <canvas id="ram-graph" width="450"></canvas>
    `
    return section;
  }

  makeDisplaySection(){
    let section = `
      <p class="sys-title-col">Display:</p>
      <p id="gpu" class="sys-data-col"></p>
      <p id="sys-screen" class="sys-data-col"></p>
      <p class="sys-title-col">Drives:</p>
      <div id="sys-info-drives"></div>
    `;

    return section;
  }

  defineCSS(){//Return the file name
    // console.log("Defining CSS for "  + this.getName);
    let styles = {
        local: [`${this.getName}-styles.css`],
        external: []
    };
    return styles;
  }

  defineScripts(){ // Returns list of all scripts + dirName + js
    // eg. ['timer.js', 'timerColor.js']
    // === ..../modules/timer/js/ + timer.js etc.
    // console.log("Loading Scripts list for " + this.getName);
    const scripts = {
      //Will be searched for in the module/js subfolder - To be run in frontent
      //Make your calls to the backend here (Still need to configure the express-server to respond)
      local: [`comp-data.js`],
      //Will be added in as is. ex: CDNs
      external: [`https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js`]
    }
    return scripts;
  }
}

module.exports = SysInfo;
