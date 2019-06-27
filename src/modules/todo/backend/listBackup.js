console.log("Backing up todos...");
const fs = require("fs");

module.exports = function (json){
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  fs.writeFile(`P:/Current Documents/Todo Backups/${day}-${month}-${year}.json`, JSON.stringify(json), (err) => {
    if(err){console.log(err);}
    console.log(`Todo's backed up to P:/Current Documents/Todo Backups/${day}-${month}-${year}.json`)
  })
}
