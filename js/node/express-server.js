var app = require('express')();
var server = require('http').Server(app);
const { exec } = require('child_process');
const commands = require('./commandExec.js');

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html');
});

app.get('/launchpad', function(req, res){
  res.sendFile(__dirname + '/test.html');
  let query = req.query.origin;
  console.log(query);

  exec(commands[query], (err, stdout, stderr) => {
    if(err)console.log(err);
    console.log(commands[query]);
  });

})
module.exports = server;
