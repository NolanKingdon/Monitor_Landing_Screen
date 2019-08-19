let si = require('systeminformation');
let exp = require('../../../core/express-server.js');
let io = exp.io;

console.log("sys-info socket loaded");

let currentLoad;
let resolution;
let gpu;
let cpuInfo;
let mbInfo;
let diskInfo;

function getHarddiskInfo(){

}

// All of the socket emits for system information come from here
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

  setInterval(
    () =>{
      si.mem( (data) => {
        let total = (data.active/data.total)*100;
        socket.emit('RAM_METRICS', { total });
      
      })
    },
    1000
  )

  // My computer hands out "Unknown" for the manufacturer, making this effectively useless.
  // si.memLayout( (data) => {
  //   console.log(data[0].manufacturer);
  //   console.log(data[0].voltageConfigured);
  //   socket.emit('RAM_INFO', {
  //       manu: data[0].manufacturer,
  //       volt: data[0].voltageConfigured
  //   })
  // })

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
