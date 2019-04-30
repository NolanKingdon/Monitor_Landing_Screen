const socket = io.connect('http://localhost');
let cpuSpd = document.getElementById("processor-speed");

socket.on('CPU_METRICS', (data) => {
  cpuSpd.innerHTML = Math.round(data.load) + "%";
})

socket.on('HARDWARE_INFO', (data) => {
  //Write hardware info to the screen
})

socket.on('NETWORK_INFO', (data) => {
  //Write network info to the screen
  //IPv4
})

socket.on('DISPLAY_INFO', (data) => {
  console.log(data);
  //write to screen
})
