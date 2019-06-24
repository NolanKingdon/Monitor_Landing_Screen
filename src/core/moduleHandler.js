// let Module = require('../modules/Module.js');
let config = require('../config/config.js');

let modDict = {}; //Storing all of our modules by name
let currentMod; //Reference variable for new modules

for(let i=0; i<config.modules.length; i++){
  //currentMod = new TestModule(config.modules[i]); // Creating our new module
  //modDict[currentMod.name] = currentMod; // Putting it into our dictionary for later
  //console.log(currentMod.getName);
  //console.log(currentMod.config);
  curName = config.modules[i].name;
  currentMod = require(`../modules/${curName}/${curName}.js`);
  currentMod = new currentMod(config.modules[i]);
  let DOM = currentMod.makeDOM();
  currentMod.setDOM = DOM;


  modDict[config.modules[i].name] = currentMod;
}
