let si = require('systeminformation');
let expServer = require('./express-server.js');
let io = require('socket.io')(expServer);

let currentLoad;
let resolution;
let gpu;
let cpuInfo;
let mbInfo;
let diskInfo;

function getHarddiskInfo(){

}


io.on('connection', function (socket) {
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

  setInterval( () => {
    diskInfo = [];
    si.fsSize( (data) => {
      for(let i=0; i<data.length; i++){
        diskInfo.push({
          drive: data[i].fs,
          type: data[i].type,
          sizeGB: data[i].size/1000000000, //bytes->gb: bytes/1e+9
          //Maybe add used GB
          percentUsed: (data[i].used / data[i].size)*100,
        })
      }
      socket.emit('MEM_INFO', {
        HDInfo: diskInfo,
      })
    })
  }, 10000);
});
