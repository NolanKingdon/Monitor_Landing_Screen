let playBtn = document.getElementById("yt-play-toggle");
let playingTitle = document.getElementById("yt-video-title");
let playing = false;
let nextBtn = document.getElementById("yt-skip");
let volume = document.getElementById("yt-volume-slider");

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: 1,//playerHeight,
    width: 1,//windowWidth,
    videoId: "hHW1oY26kxQ",
    playerVars: {
      color: "white",
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
  if(playing){
    event.target.playVideo();
  }
}
var done = false;

function onPlayerStateChange(event) {
  
  player.setVolume(volume.value);

  let title = player.getVideoData().title;

  if(event.data === -1){//unstarted
    updatePlaying(title);
    if(playing){
      player.playVideo();
    }
  }
  if(event.data === 1){//playing
    updatePlaying(title);
  }

  if(event.data === 2){//on pause
      
  }

  if(event.data === 3){//buffering
    event.target.setShuffle({'shufflePlayList' : true}); // Shuffles our playlist if we have one
  }

  if(event.data === 5){//Queued
    updatePlaying(title);
    if(playing){
      player.playVideo();
    }
  }

}
// Continues music if one of the videos is unplayable
function onPlayerError(event){
  player.nextVideo();
}

function updateVolume(vol){
  player.setVolume(vol);
}

function updatePlaying(text){
  playingTitle.innerHTML = text;
}

function togglePlaying(){
  playing = !playing;
  if(playing){
    playBtn.innerText = "Pause";
    player.playVideo();
  } else {
    playBtn.innerText = "Play";
    player.pauseVideo();
  }
}

function nextVid(){
  player.nextVideo();
  player.pauseVideo();
}

function editVarsTest(){
  player.cuePlaylist({
    listType: "playlist",
    list: "PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG"
  })
}
