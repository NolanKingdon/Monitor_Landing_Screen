const startTime = new Date();
let currTime = startTime;
const clock = document.getElementById("clock");
const date = document.getElementById("date");
const body = document.getElementsByTagName("body")[0];
/*let time = {
  seconds: startTime.getSeconds(),
  minutes: startTime.getMinutes(),
  hours: startTime.getHours(),
  day: startTime.getDate(),
  month: startTime.getMonth()+1,
  year: startTime.getFullYear()
}*/

let time = {
  seconds:58,
  minutes:59,
  hours:23,
  day:5,
  month:2,
  year:2019
}
let backgroundColor = "#" + time.hours + time.minutes + time.seconds;

function setClock(time){
  clock.innerHTML = "#" + time.hours + time.minutes + time.seconds;
}

function setDate(time){
  date.innerHTML = time.day + "/" + time.month + "/" + time.year;
}

function setBackground(time){
  body.style.backgroundColor = "#" + time.hours + time.minutes + time.seconds;
}

function updateTime(oldTime){
  if(oldTime.seconds === 59) {
    oldTime.seconds = "00";
    if(oldTime.minutes === 59) {
      oldTime.minutes = 0;
      if (oldTime.hours === 23){
        currTime = new Date();
        /*
        Requesting a new Date daily - ensures I don't have to calculate days in
        a month, leap years, etc., and happens infrequently enough so that there
        is no time delay as would be the case if I did this for every second
        */
        time = {
          seconds: currTime.getSeconds(),
          minutes: currTime.getMinutes(),
          hours: currTime.getHours(),
          day: currTime.getDate(),
          month: currTime.getMonth()+1,
          year: currTime.getFullYear()
        }
      } else {
        oldTime.hours ++;
      }
    } else {
      oldTime.minutes ++;
    }
  } else {
    oldTime.seconds ++;
  }

  if(time.seconds.toString().length === 1){
    time.seconds = "0" + time.seconds.toString();
  }
  if(time.minutes.toString().length === 1){
    time.minutes = "0" + time.minutes.toString();
  }
  if(time.hours.toString().length === 1){
    time.hours = "0" + time.hours.toString();
  }

  setClock(time);
  setDate(time);
  setBackground(time);
}

setInterval(function(){updateTime(time, currTime)}, 1000);
