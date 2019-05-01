const socket = io.connect('http://localhost');
let cpuSpd = document.getElementById("processor-speed");
let gpu = document.getElementById("gpu");
let resolution = document.getElementById("sys-screen");

//Chart

//Sockets
socket.on('CPU_METRICS', (data) => {
  cpuSpd.innerHTML = Math.round(data.load) + "%";
})

//Normally I wouldn't use a socket here... but it's convenient to all have in one place
socket.on('HARDWARE_INFO', (data) => {
  console.log(data);
  //Write hardware info to the screen
})

socket.on('DISPLAY_INFO', (data) => {
  console.log(data);
  gpu.innerHTML = data.gpu;
  resolution.innerHTML = data.resolution.x + "x" + data.resolution.y;
  //write to screen
})

socket.on('MEM_INFO', (data) => {
  console.log(data);
});
