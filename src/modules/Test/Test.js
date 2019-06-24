const Module = require('../Module.js');

class Test extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " has been created");
  }

  makeDOM(){
    console.log("Making dom");
    // User code here
    return "This is my DOM";
  }

}

module.exports = Test;
