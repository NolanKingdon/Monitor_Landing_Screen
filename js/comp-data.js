const socket = io.connect('http://localhost');
let cpuSpd = document.getElementById("processor-speed");
let cpuType = document.getElementById("sys-cpu-info");
let gpu = document.getElementById("gpu");
let resolution = document.getElementById("sys-screen");
let drives = document.getElementById("sys-info-drives");
let prevLength = 0

//Chart

//Sockets
socket.on('CPU_METRICS', (data) => {
  cpuSpd.innerHTML = Math.round(data.load) + "%";
})

//Normally I wouldn't use a socket here... but it's convenient to all have in one place
socket.on('HARDWARE_INFO', (data) => {
  cpuType.innerHTML = data.cpu.brand + ", " + data.cpu.speed; //+ data.cpu.cores;
  //Write hardware info to the screen
})

socket.on('DISPLAY_INFO', (data) => {
  gpu.innerHTML = data.gpu;
  resolution.innerHTML = data.resolution.x + "x" + data.resolution.y;
  //write to screen
})

socket.on('MEM_INFO', (data) => {
  drives.innerHTML = "";
  // Consider just re-writing everytime to the DOM: Accurate memory estimates
  // Alternatively: Rewrite to the DOM x emits? We won't have a huge amount of
  //    Wites, so it's probably fine?
  for(let i=0; i<data.HDInfo.length; i++){

    let driveRow = document.createElement("div");
    driveRow.className = "sys-info-drive-row";

    let driveLetter = document.createElement("p");
    driveLetter.innerHTML = data.HDInfo[i].drive + " ";

    let driveGB = document.createElement("p");
    driveGB.innerHTML = Math.round(data.HDInfo[i].sizeGB) + "GB";

    let progressContainer = document.createElement("div");
    progressContainer.className = "sys-info-progress-container";

    let progressBar = document.createElement("div");
    progressBar.className = "sys-info-progress-bar";
    progressBar.style.width = data.HDInfo[i].percentUsed + "%";

    progressContainer.appendChild(progressBar);

    let percent = document.createElement("p");
    percent.innerHTML = Math.round(data.HDInfo[i].percentUsed*100)/100 + "%";

    driveRow.appendChild(driveLetter);
    driveRow.appendChild(driveGB);
    driveRow.appendChild(progressContainer);
    driveRow.appendChild(percent);

    drives.appendChild(driveRow);
  }


  if(data.HDInfo.length !== prevLength){
    //Add/clearout the items dynamically
    prevLength = data.HDInfo.length;
  } else {
    //Do nothing
  }
});
