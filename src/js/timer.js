//Timer face
const hours = document.getElementById("timer-hours"),
      minutes = document.getElementById("timer-minutes"),
      seconds = document.getElementById("timer-seconds");

//Control Buttons
const incTimerMin = document.getElementById("increment-timer-minute"),
      decTimerMin = document.getElementById("decrement-timer-minute"),
      incTimerHr = document.getElementById("increment-timer-hour"),
      decTimerHr = document.getElementById("decrement-timer-hour"),
      incTimerSec = document.getElementById("increment-timer-second"),
      decTimerSec = document.getElementById("decrement-timer-second"),
      startTimer = document.getElementById("start-timer"),
      pauseTimer = document.getElementById("pause-timer"),
      resetTimer = document.getElementById("reset-timer");

let timerInterval;
let finishedAlert;
let counting = false;

function addSecond(){
  if(!counting){
    seconds.innerHTML = ((parseInt(seconds.innerHTML) + 1).toString().length === 1 ?
                      "0" + (parseInt(seconds.innerHTML) + 1).toString() :
                      (parseInt(seconds.innerHTML) + 1).toString());
  }
}

function addMinute(){
  if(!counting){
    minutes.innerHTML = ((parseInt(minutes.innerHTML) + 1).toString().length === 1 ?
                      "0" + (parseInt(minutes.innerHTML) + 1).toString() :
                      (parseInt(minutes.innerHTML) + 1).toString());
  }
}

function addHour(){
  if(!counting){
    hours.innerHTML = ((parseInt(hours.innerHTML) + 1).toString().length === 1 ?
                        "0" + (parseInt(hours.innerHTML) + 1).toString() :
                        (parseInt(hours.innerHTML) + 1).toString());
  }
}

function rmvSecond(){
  if(seconds.innerHTML !== "00" && !counting){
    seconds.innerHTML = ((parseInt(seconds.innerHTML) - 1).toString().length === 1 ?
                        "0" + (parseInt(seconds.innerHTML) - 1).toString() :
                        (parseInt(seconds.innerHTML) - 1).toString());
  }
}

function rmvMinute(){
  if(minutes.innerHTML !== "00" && !counting){
    minutes.innerHTML = ((parseInt(minutes.innerHTML) - 1).toString().length === 1 ?
                        "0" + (parseInt(minutes.innerHTML) - 1).toString() :
                        (parseInt(minutes.innerHTML) - 1).toString());
  }
}

function rmvHour(){
  if(hours.innerHTML !=="00" && !counting){
    hours.innerHTML = ((parseInt(hours.innerHTML) - 1).toString().length === 1 ?
                      "0" + (parseInt(hours.innerHTML) - 1).toString() :
                      (parseInt(hours.innerHTML) - 1).toString());

  }
}

function beginCount(){
  counting = true;
  finishedAlert = new Audio();
  finishedAlert.src = "./media/mp3/old-fashioned-school-bell-daniel_simon.mp3";
  timerInterval = setInterval(
    () => {
      if(seconds.innerHTML === "00") {
        seconds.innerHTML = "59";
        if(minutes.innerHTML === "00") {
          minutes.innerHTML = "59";
          if (hours.innerHTML === "00"){
          } else {
            hours.innerHTML = ((parseInt(hours.innerHTML)-1).toString().length === 1 ?
            "0" + (parseInt(hours.innerHTML)-1).toString() :
            (parseInt(hours.innerHTML)-1).toString());
          }
        } else {
          minutes.innerHTML = ((parseInt(minutes.innerHTML)-1).toString().length === 1 ?
          "0" + (parseInt(minutes.innerHTML)-1).toString() :
          (parseInt(minutes.innerHTML)-1).toString());
        }
      } else {
        seconds.innerHTML = ((parseInt(seconds.innerHTML)-1).toString().length === 1 ?
        "0" + (parseInt(seconds.innerHTML)-1).toString() :
        (parseInt(seconds.innerHTML)-1).toString());
      }
      //Checking if we're done
      if(seconds.innerHTML === "00" && minutes.innerHTML === "00" && hours.innerHTML === "00"){
        finishedAlert.play();
        pauseCount();
      }
    }, 1000);
}

function pauseCount(){
  clearInterval(timerInterval);
  counting = false;
}

function clearCount(){
  pauseCount();
  finishedAlert.pause();
  seconds.innerHTML = "00";
  minutes.innerHTML = "00";
  hours.innerHTML = "00";
}

//Testing nonsense below

let invisScrollerHours = document.getElementById("hours-invisible-scroll");
invisScrollerHours.scrollTop = 20;
invisScrollerHours.addEventListener("scroll", (e)=>{
  if(e.target.scrollTop == 19){
    console.log("Scrolled up");
    addHour();
  } else if(e.target.scrollTop == 21){
    console.log("Scrolled Down")
    rmvHour();
  }
  e.target.scrollTop = 20;
  }
)

let invisScrollerMinutes = document.getElementById("minutes-invisible-scroll");
invisScrollerMinutes.scrollTop = 20;
invisScrollerMinutes.addEventListener("scroll", (e)=>{
  if(e.target.scrollTop == 19){
    console.log("Scrolled up");
    addMinute();
  } else if(e.target.scrollTop == 21){
    console.log("Scrolled Down")
    rmvMinute();
  }
  e.target.scrollTop = 20;
  }
)
let invisScrollerSeconds = document.getElementById("seconds-invisible-scroll");
invisScrollerSeconds.scrollTop = 20;
invisScrollerSeconds.addEventListener("scroll", (e)=>{
  if(e.target.scrollTop == 19){
    console.log("Scrolled up");
    addSecond();
  } else if(e.target.scrollTop == 21){
    console.log("Scrolled Down")
    rmvSecond();
  }
  e.target.scrollTop = 20;
  }
)
