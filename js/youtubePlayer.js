/**
 * Sample JavaScript code for youtube.search.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function loadClient(inputValue) {
  gapi.client.setApiKey("AIzaSyAH139KPDwovLKqT2l9JTX2rNBnzsp-4jU");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() {
        console.log("GAPI client loaded for API");
        execute(inputValue);
       },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded before calling this method.

let submitButton = document.getElementById("yt-submit");
let inputValue;
submitButton.addEventListener("click", () => {
  let input = document.getElementById("yt-input");
  let inputValue = input.value;
  loadClient(inputValue);
});

let optionsBtn  = document.getElementById('yt-options');
optionsBtn.addEventListener("click", ()=>{
  if(missedVideo.style.display === "none" || missedVideo.style.display === ""){
    missedVideo.style.display = "block";
  } else {
    missedVideo.style.display = "none";
  }
});

function execute(input) {
  console.log("input: ", input);
  return gapi.client.youtube.search.list({
    "part"      : "snippet",
    "maxResults": 10,
    "q"         : input,
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
              console.log(response.result.items.length);
              let responseVids = [];
              for(let i=0; i< response.result.items.length; i++){
                responseVids.push({
                  type:     response.result.items[i].id.kind,
                  id:       response.result.items[i].id.videoId ? response.result.items[i].id.videoId : response.result.items[i].id.playlistId,
                  title:    response.result.items[i].snippet.title,
                  thumbURL: response.result.items[i].snippet.thumbnails.medium.url,
                  link:     "https://www.youtube.com/watch?v=" + response.result.items[i].id.videoId
                })
              }
              displayVideos(responseVids);

            },
            function(err) { console.error("Execute error", err); });
}

function displayVideos(videoList){//Displaying Search results on dash
  console.log(videoList);
  resultContainer = document.getElementById("yt-search-results");
  while(resultContainer.firstChild){
      resultContainer.removeChild(resultContainer.firstChild);
    }

  for(let i=0; i<videoList.length; i++){
    let vidContainer = document.createElement("div");
    vidContainer.className = "yt-search-result-item";

    vidContainer.addEventListener("click", () => {
      //Distinguishing between solo video and playlist
      if(videoList[i].type === "youtube#video"){
        player.loadVideoById(videoList[i].id, "large");
        playing = false;
        playBtn.innerHTML = "Play";
      } else if(videoList[i].type === "youtube#playlist"){
        playing = false;
        playBtn.innerHTML = "Play";
        player.cuePlaylist({
          listType: "playlist",
          list: videoList[i].id,
        });
      }
      //Below will auto-close search results. Given costly nature of searching, let's leave this out
      // resultContainer.style.display = "none";

      //TODO - Add in sleek styles for the search function
      //     - Add in playlist compatibility
    });

    //Title for Item
    let vidTitle = document.createElement("h1");
    vidTitle.className = "yt-search-video-title";
    if(videoList[i].title.length > 15) {
      displayTitle = videoList[i].title.slice(0, 15).toLowerCase();
      displayTitle += "...";
    } else {
      displayTitle = videoList[i].title.toLowerCase();
    }
    vidTitle.innerHTML = displayTitle;
    //img for item
    let thumbnail = document.createElement("img");
    thumbnail.className = "yt-search-video-thumb";
    thumbnail.src = videoList[i].thumbURL;
    thumbnail.title = videoList[i].title;

    vidContainer.appendChild(vidTitle);
    vidContainer.appendChild(thumbnail);
    resultContainer.appendChild(vidContainer);
  }

  resultContainer.style.display = "flex";
  resultContainer.style.bottom = "0px";
}

gapi.load("client");
let openPage = false;


//Loading our initial videos
const initialVids = [
  {type: "youtube#playlist", id: "PL0KqfOQxyR-OtZuIHKjkDeIrrPeDI7C0a", title: "Upbeat", thumbURL: "https://i.ytimg.com/vi/KVt2Qweiydg/mqdefault.jpg", link: "https://www.youtube.com/playlist?list=PL0KqfOQxyR-OtZuIHKjkDeIrrPeDI7C0a"},
  {type: "youtube#playlist", id: "PL0KqfOQxyR-PvINHO2yS8BoytoGoY21my", title: "Relaxed", thumbURL: "https://i.ytimg.com/vi/6zvIxD4FUTA/mqdefault.jpg", link: "https://www.youtube.com/playlist?list=PL0KqfOQxyR-PvINHO2yS8BoytoGoY21my"},
  {type: "youtube#playlist", id: "PL0KqfOQxyR-MyhQmlz4Jj6qbnc-Kue7J8", title: "Trance", thumbURL: "https://i.ytimg.com/vi/IVvpfQjR6jQ/mqdefault.jpg", link: "https://www.youtube.com/playlist?list=PL0KqfOQxyR-MyhQmlz4Jj6qbnc-Kue7J8"},
  {type: "youtube#video", id: "hHW1oY26kxQ", title: "lofi hip hop radio - beats to relax/study to", thumbURL: "https://i.ytimg.com/vi/hHW1oY26kxQ/mqdefault_live.jpg", link: "https://www.youtube.com/watch?v=hHW1oY26kxQ"},
  {type: "youtube#video", id: "SmbdY5FpRwA", title: "lofi hip hop radio - beats to sleep/chill to", thumbURL: "https://i.ytimg.com/vi/SmbdY5FpRwA/mqdefault_live.jpg", link: "https://www.youtube.com/watch?v=SmbdY5FpRwA"},
  {type: "youtube#video", id: "zOPn5meO3lE", title: "breakfast. [jazz hop / lofi / chill mix]", thumbURL: "https://i.ytimg.com/vi/zOPn5meO3lE/mqdefault.jpg", link: "https://www.youtube.com/watch?v=zOPn5meO3lE"},
];
displayVideos(initialVids);
