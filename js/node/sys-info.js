let si = require('systeminformation');
let expServer = require('./express-server.js');
let io = require('socket.io')(expServer);

let currentLoad;
let resolution;
let gpu;
let cpuInfo;
let mbInfo;
let memInfo;

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

  //Websockets are overkill, but it was convenient to keep it all in one place like this
  si.cpu( (data) => {
    cpuInfo = {
      manufacturer: data.manufacturer,
      brand: data.brand,
      speed: data.speed + "GHz",
      cores: data.cores + " core"
    }
    si.baseboard( (data) => {
      mbInfo = {
        maker: data.manufacturer,
        model: data.model
      }
        //This is some ugly nesting. But... It works I guess?
      socket.emit('HARDWARE_INFO', {
        cpu: cpuInfo,
        mb: mbInfo,
      })
    })
  })

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

//TODO - Fix this. I'm querying the RAM not the Harddrives like I want
  si.mem( (data) => {
    memInfo = {
      total: data.total,
      used: data.used,
      available: data.available
    }
    console.log(memInfo);

    socket.emit('MEM_INFO', {
      memInfo: memInfo,
    })

  });
});
