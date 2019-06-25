let config = require('../config/config.js');
let modDict = {}; //Storing all of our modules by name
let currentMod; //Reference variable for new modules
let cssPile = [];
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
  console.log(config.modules[i].location);
  DOMPile[config.modules[i].location] += currentMod.getDOM;
  //Adding CSS references
  // TODO - Think about making this specific using IDs or classes --> Take some work off of the user
  currentMod.setCSS = currentMod.defineCSS();
  cssPile.push(`../modules/${curName}/css/${currentMod.getCSS}`);
  //Adding script references
  currentMod.setScripts = currentMod.defineScripts();
  scriptPile["local"].push(`../modules/${curName}/js/${currentMod.getScripts["local"]}`);
  console.log(scriptPile);
  scriptPile["external"].push(currentMod.getScripts["external"]);
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
