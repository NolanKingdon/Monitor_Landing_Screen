let config = require('../config/config.js');
let modDict = {}; //Storing all of our modules by name
let currentMod; //Reference variable for new modules
let cssPile = {
  local: [],
  external: []
};
let DOMPile = { // TODO - add in dynamic columns to config file and instantiate here
  0: ``,
  1: ``,
  2: ``
};
let scriptPile = {
  local: [],
  external: []
};

// Iterating our config file
for(let i=0; i<config.modules.length; i++){
  // Adding a reference to the current name (From the config file)
  curName = config.modules[i].name;
  // Requiring the necessary file --> Based on name. File structure depends on the module
  // Having the same name as the file path
  currentMod = require(`../modules/${curName}/${curName}.js`);
  // Creating the currentModule with the module we just loaded in - TODO - fix this redundancy
  currentMod = new currentMod(config.modules[i]);
  //Adding HTML to the template string
  DOMPile[config.modules[i].location] += currentMod.getDOM;
  //Adding CSS references
  // TODO - Think about making this specific using IDs or classes --> Take some work off of the user
  currentMod.setCSS = currentMod.defineCSS();
  if(currentMod.getCSS["local"].length != 0){
    for(let i=0; i<currentMod.getCSS["local"].length; i++){
      cssPile["local"].push(`../modules/${curName}/css/${currentMod.getCSS["local"][i]}`);
    }
  }

  if(currentMod.getCSS["external"].length != 0){
    for(let i=0; i<currentMod.getCSS["external"].length; i++){
      cssPile["external"].push(currentMod.getCSS["external"][i]);
    }
  }
  //Adding script references
  currentMod.setScripts = currentMod.defineScripts();
  if(currentMod.getScripts["local"].length !== 0){
    for(let i=0; i<currentMod.getScripts["local"].length; i++){
      scriptPile["local"].push(`../modules/${curName}/js/${currentMod.getScripts["local"][i]}`);
    }
  }
  if(currentMod.getScripts["external"].length !== 0){
    for(let i=0; i<currentMod.getScripts["external"].length; i++){
      scriptPile["external"].push(currentMod.getScripts["external"][i]);
    }
  }
  // Adding the current module to the dict under it's given name
  modDict[config.modules[i].name] = currentMod;
  console.log(currentMod.getName + " load completed");
}

//Our return package
const pageTemplate = {
  DOMPile, // Template String
  cssPile, // List of Strings
  scriptPile // List of lists
}

// console.log(pageTemplate.DOMPile);
module.exports = pageTemplate;
