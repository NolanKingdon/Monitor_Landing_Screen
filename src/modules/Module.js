class Module {
  // this.config;
  // this.cssPath;
  // this.DOMTemplate = ``;
  // this.scriptLocations = [];

  constructor(config, name){
    this.config = config;
    this.name = config.name;
  }

  sendNotification(){
    //Sends socket notifications
  }

  get getName(){
    return this.name;
  }

  set setDOM(domString){
    //returns the DOM template string
    this.DOMString = domString;
  }

  get getDOM(){
    console.log("Getting DOM")
  }

  set setScripts(scripts){
    //Additional Scripts
    this.scripts = scripts;
  }

  get getScripts(){
    return this.scripts;
  }

  createWindow(){
    console.log("Creating a window");
    //Creates additional windows
  }

  get getCSS(){
    //returns string of css files
    return this.cssPath;
  }

  set setCSS(cssPath){
    this.cssPath = cssPath;
    //Sets css path
  }
}

module.exports = Module;
