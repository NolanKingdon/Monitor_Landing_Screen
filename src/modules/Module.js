class Module {

  constructor(config){
    this.config = config;
    this.name = config.name;
  }

  sendNotification(){
    //Sends socket notifications
  }

  get getName(){
    return this.name;
  }

  get getDOM(){
    // console.log("Getting DOM from " + this.getName)
    this.setDOM = this.makeDOM();
    return this.DOMString;
  }
  set setDOM(domString){
    // console.log("Setting DOM for "  + this.getName);
    //returns the DOM template string
    this.DOMString = domString;
  }

  get getScripts(){
    // console.log("Getting Scripts for " + this.getName);
    return this.scripts;
  }

  set setScripts(scripts){
    //Additional Scripts
    // console.log("Setting Scripts for "  + this.getName);
    this.scripts = scripts;
  }

  createWindow(){
    // console.log("Creating a window for " + this.config.name);
    //Creates additional windows
  }

  get getCSS(){
    //returns string of css files
    // console.log("Getting CSS path for "  + this.getName);
    return this.cssPath;
  }

  set setCSS(cssPath){
    // console.log("Setting CSS for "  + this.getName);
    this.cssPath = cssPath;
    //Sets css path
  }
}

module.exports = Module;
