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
  let input = document.getElementById("youtube-input");
  let inputValue = input.value;
  loadClient(inputValue);
});

function execute(input) {
  console.log("input: ", input);
  return gapi.client.youtube.search.list({
    "part": "snippet",
    "maxResults": 10,
    "q": input,
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
              console.log(response.result.items.length);
              let responseVids = [];
              for(let i=0; i< response.result.items.length; i++){
                responseVids.push({
                  id:       response.result.items[i].id.videoId,
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
      player.loadVideoById(videoList[i].id, "large");
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
    console.log("Should work");
    resultContainer.appendChild(vidContainer);
  }

  resultContainer.style.display = "flex";
  resultContainer.style.bottom = "0px";
}

gapi.load("client");
let openPage = false;



// TESTING -- UNCOMMENT EVERYTHING ELSE LATER
// let responseVids = [
//           {
//             id: "v0IX7a7Xsik",
//             link: "https://www.youtube.com/watch?v=v0IX7a7Xsik",
//             thumbURL: "https://i.ytimg.com/vi/v0IX7a7Xsik/mqdefault.jpg",
//             title: "SURFING THE WEDGE WITH WORLD CHAMP BLAIR CONKLIN",
//           },
//           {
//             id: "nkhpGC10OVw",
//             link: "https://www.youtube.com/watch?v=nkhpGC10OVw",
//             thumbURL: "https://i.ytimg.com/vi/nkhpGC10OVw/mqdefault.jpg",
//             title: "World&#39;s best surfing 2017",
//           },
//           {
//             id: "v0IX7a7Xsik",
//             link: "https://www.youtube.com/watch?v=v0IX7a7Xsik",
//             thumbURL: "https://i.ytimg.com/vi/v0IX7a7Xsik/mqdefault.jpg",
//             title: "SURFING THE WEDGE WITH WORLD CHAMP BLAIR CONKLIN",
//           },
//           {
//             id: "nkhpGC10OVw",
//             link: "https://www.youtube.com/watch?v=nkhpGC10OVw",
//             thumbURL: "https://i.ytimg.com/vi/nkhpGC10OVw/mqdefault.jpg",
//             title: "World&#39;s best surfing 2017",
//           },
//           {
//             id: "v0IX7a7Xsik",
//             link: "https://www.youtube.com/watch?v=v0IX7a7Xsik",
//             thumbURL: "https://i.ytimg.com/vi/v0IX7a7Xsik/mqdefault.jpg",
//             title: "SURFING THE WEDGE WITH WORLD CHAMP BLAIR CONKLIN",
//           },
//           {
//             id: "nkhpGC10OVw",
//             link: "https://www.youtube.com/watch?v=nkhpGC10OVw",
//             thumbURL: "https://i.ytimg.com/vi/nkhpGC10OVw/mqdefault.jpg",
//             title: "World&#39;s best surfing 2017",
//           },
//           {
//             id: "v0IX7a7Xsik",
//             link: "https://www.youtube.com/watch?v=v0IX7a7Xsik",
//             thumbURL: "https://i.ytimg.com/vi/v0IX7a7Xsik/mqdefault.jpg",
//             title: "SURFING THE WEDGE WITH WORLD CHAMP BLAIR CONKLIN",
//           },
//           {
//             id: "nkhpGC10OVw",
//             link: "https://www.youtube.com/watch?v=nkhpGC10OVw",
//             thumbURL: "https://i.ytimg.com/vi/nkhpGC10OVw/mqdefault.jpg",
//             title: "World&#39;s best surfing 2017",
//           }
//         ];
//
// let submitButton = document.getElementById("yt-submit");
// let inputValue;
// submitButton.addEventListener("click", () => {
//   displayVideos(responseVids);
// });
