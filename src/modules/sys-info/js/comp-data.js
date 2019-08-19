const socket = io.connect('http://localhost'); // Connecting to our localhost for socket
let cpuSpd = document.getElementById("processor-speed");
let cpuType = document.getElementById("sys-cpu-info");
let ramSpd = document.getElementById("ram-percent");
let gpu = document.getElementById("gpu");
let resolution = document.getElementById("sys-screen");
let drives = document.getElementById("sys-info-drives");
let prevLength = 0

//Chart

class CPUGraph {
  constructor(canvasID){
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.points = [];
  }

  drawGraph(){
    this.drawBorder();
    this.drawPoints();
  }

  drawBorder(){
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    this.ctx.moveTo(37, 20);
    this.ctx.lineTo(37, 120);
    this.ctx.lineTo(430, 120);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawPoints(point){
    if(this.points.length < 11){
      this.points.push(point);
    } else {
      this.points.shift();
      this.points.push(point);
    }

    this.ctx.clearRect(37, 19, 431, 101);

    let count = 0;
    this.ctx.beginPath();
    // this.ctx.moveTo(37, pointsY[0]);
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    for(let i=1; i<=this.points.length; i++){
      if(count == 0){this.ctx.strokeStyle = "transparent"} else {this.ctx.strokeStyle = "rgba(255,255,255,1)"}
      this.ctx.lineTo(i*38, 120-this.points[count]);
      // this.ctx.arc(i*37, this.points[count], 3, 0, 2*Math.PI);
      this.ctx.stroke();
      count++;
    }
    this.ctx.strokeStyle = "transparent";
    this.ctx.fillStyle = "rgba(255,255,255,0.2)";
    this.ctx.lineTo(this.points.length*38, 120);
    this.ctx.lineTo(38, 120);
    this.ctx.lineTo(38, this.points[0]);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

let cpuG = new CPUGraph("cpu-graph");
cpuG.drawBorder();

let ramG = new CPUGraph("ram-graph");
ramG.drawBorder();

//Sockets
socket.on('CPU_METRICS', (data) => {
  cpuSpd.innerHTML = Math.round(data.load) + "%";
  cpuG.drawPoints(Math.round(data.load));
})

socket.on('RAM_METRICS', (data) => {
  ramSpd.innerHTML = Math.round(data.total) + "%";
  ramG.drawPoints(data.total);
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
