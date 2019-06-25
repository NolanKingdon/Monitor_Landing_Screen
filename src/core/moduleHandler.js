console.log("Yay?")
let config = require('../config/config.js');
let modDict = {}; //Storing all of our modules by name
let currentMod; //Reference variable for new modules
let cssPile = [];
let DOMPile = ``;
let scriptPile = [];

for(let i=0; i<config.modules.length; i++){
  //Loading the module into existance
  curName = config.modules[i].name;
  currentMod = require(`../modules/${curName}/${curName}.js`);
  currentMod = new currentMod(config.modules[i]);
  //Adding HTML to the template string
  DOMPile += currentMod.getDOM;
  //Adding CSS references
  // TODO - Think about making this specific using IDs or classes --> Take some work off of the user
  currentMod.setCSS = currentMod.defineCSS();
  cssPile.push(`../modules/${curName}/css/${currentMod.getCSS}`);
  //Adding script references
  currentMod.setScripts = currentMod.defineScripts();
  scriptPile.push(currentMod.getScripts);
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

console.log(pageTemplate);
module.exports = pageTemplate;
