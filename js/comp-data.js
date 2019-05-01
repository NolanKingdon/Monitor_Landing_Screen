const socket = io.connect('http://localhost');
let cpuSpd = document.getElementById("processor-speed");
let gpu = document.getElementById("gpu");
let resolution = document.getElementById("sys-screen");

socket.on('CPU_METRICS', (data) => {
  cpuSpd.innerHTML = Math.round(data.load) + "%";
})


//Normally I wouldn't use a socket here... but it's convenient to all have in one place
socket.on('HARDWARE_INFO', (data) => {
  //Write hardware info to the screen
})

socket.on('NETWORK_INFO', (data) => {
  //Write network info to the screen
  //IPv4
})

socket.on('DISPLAY_INFO', (data) => {
  console.log(data);
  gpu.innerHTML = data.gpu;
  resolution.innerHTML = data.resolution.x + "x" + data.resolution.y;
  //write to screen
})
