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

for(let i=0; i<config.modules.length; i++){
  //Loading the module into existance
  curName = config.modules[i].name;
  currentMod = require(`../modules/${curName}/${curName}.js`);
  currentMod = new currentMod(config.modules[i]);
  //Adding HTML to the template string
  DOMPile[config.modules[i].location] += currentMod.getDOM;
  //Adding CSS references
  // TODO - Think about making this specific using IDs or classes --> Take some work off of the user
  currentMod.setCSS = currentMod.defineCSS();
  if(currentMod.getCSS["local"].length != 0){
    cssPile["local"].push(`../modules/${curName}/css/${currentMod.getCSS["local"]}`);
  }

  if(currentMod.getCSS["external"].length != 0){
    cssPile["external"].push(currentMod.getCSS["external"]);
  }
  //Adding script references
  currentMod.setScripts = currentMod.defineScripts();
  if(currentMod.getScripts["local"].length !== 0){
    scriptPile["local"].push(`../modules/${curName}/js/${currentMod.getScripts["local"]}`);
  }
  if(currentMod.getScripts["external"].length !== 0){
    scriptPile["external"].push(currentMod.getScripts["external"]);
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
