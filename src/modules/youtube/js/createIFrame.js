const windowWidth = window.innerWidth/2;
const playerHeight = windowWidth * 0.6;
const starterVideo = (Math.floor(Math.random() * 214)).toString();
let playBtn = document.getElementById("yt-play-toggle");
let marqueeText = document.getElementById("yt-title-scroll");
let playing = false;

let missedVideo = document.getElementById("yt-missed-video-debug");
let missedVideoList = document.getElementById("yt-missed-list");

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: playerHeight,
    width: windowWidth,
    //videoId: "hHW1oY26kxQ",
    playerVars: {
      color: "white",
      listType: "playlist",
      list: "PL0KqfOQxyR-MLbyTZLFUQuOfr9V5ElNSc",
      index: starterVideo,
      disablekb: 1,//No keyboard controls
      enablejsapi: 1,//Allowing btn control
      fs: 0,//Fullscreen off
      iv_load_policy: 3,//annotations not default
      modestbranding: 1,//prevents youtube logo
      controls: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError,
    }
  });
}
function onPlayerReady(event) {
  event.target.playVideo();
}
var done = false;

function onPlayerStateChange(event) {
  console.log(player.getVolume());//TODO - volume slider
  if(event.data === -1){//unstarted
    let title = player.getVideoData().title;
    changeMarquee(title);
  }
  if(event.data === 1){//playing
  }
  if(event.data === 2){//on pause
  }
  if(event.data === 3){//buffering
    event.target.setShuffle({'shufflePlayList' : true});
  }
}
function onPlayerError(event){
  let missedVideo = document.createElement("li");
  missedVideo.innerHTML = player.getVideoData().title;
  missedVideoList.appendChild(missedVideo);
  player.nextVideo();
  playing = true;
}

function changeMarquee(text){
  marqueeText.innerHTML = text;
}

function togglePlaying(){
  if(playing){
    playBtn.innerHTML = "Play";
    playing = false;
    player.pauseVideo();
  } else if(!playing){
    playBtn.innerHTML = "Pause";
    playing = true;
    player.playVideo();
  }
}

function nextVid(){
  player.nextVideo();
  playing = true;
}

function editVarsTest(){
  player.cuePlaylist({
    listType: "playlist",
    list: "PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG"
  })
}
