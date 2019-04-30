let si = require('systeminformation');
let expServer = require('./express-server.js');
let io = require('socket.io')(expServer);

let currentLoad;
let resolution;
let gpu;

io.on('connection', function (socket) {
  console.log("Connection Successful");


  //Sending CPU processing speed
  setInterval( () => {
    si.currentLoad( (data) => {
      currentLoad = data.currentload;
      socket.emit('CPU_METRICS', {
        load: currentLoad
      })
    })
    }, 1000
  );


  //Sending GPU and resolution information
  si.graphics( (data) => {
    resolution = {
      x: data.displays[0].resolutionx,
      y: data.displays[0].resolutiony,
    };
    gpu = data.controllers[0].model;

    socket.emit('DISPLAY_INFO', {
      resolution,
      gpu
    })
  });

});
