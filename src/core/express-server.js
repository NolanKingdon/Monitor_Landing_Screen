console.log(__dirname + "/test.html");
var app = require('express')();
var server = require('http').Server(app);
const { exec } = require('child_process');
const commands = require('../modules/Launchpad/backend/commandExec.js');
const io = require('socket.io')(server);
const bp = require('body-parser');
let VPN_ACTIVE = false;

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});

app.get('/launchpad', function(req, res){
  res.sendFile(__dirname + '/test.html');
  let query = req.query.origin;

  console.log(query);
  // Tracking our toggle for nordVPN
  if(query == "nordVPN"){
  //  commands[query] = commands[query] + VPN_TOGGLE;
    //console.log(commands[query]);
    if(VPN_ACTIVE){
      // VPN is Currently active
      exec("D:\\Documents\\JavaScript\\node\\electron\\monitor-home-screen\\src\\modules\\launchpad\\backend\\nordD.bat", (err, stdout, stderr) =>{
        if(err) console.log(err);
      })
      VPN_ACTIVE = false;
    } else {
      // VPN is currently inactive
      exec("D:\\Documents\\JavaScript\\node\\electron\\monitor-home-screen\\src\\modules\\launchpad\\backend\\nordC.bat", (err, stdout, stderr) =>{
        if(err) console.log(err);
      VPN_ACTIVE = true;
      })
    }
  } else {
    exec(commands[query], (err, stdout, stderr) => {
      if(err)console.log(err);
      console.log(commands[query]);
    });
  }

})

app.get('/moduleHandler', function(req, res){
  //res.sendFile(__dirname + '/test.html');
  const domMakeup = require("./moduleHandler.js");
  res.json(domMakeup);
});

app.post('/listBackup', function(req, res){
  const backupper = require("../modules/Todo/backend/listBackup.js");
  backupper(req.body);

  // console.log(req.body);
});

module.exports = {
  server,
  io
};
