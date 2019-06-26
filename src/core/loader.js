const http = new XMLHttpRequest();
http.onreadystatechange = () => {
  if(http.readyState == 4 && http.status == 200){
      // *** Parsing response
      const parsedRes = JSON.parse(http.responseText);
      const DOM = parsedRes.DOMPile;
      const CSS = parsedRes.cssPile;
      const SCRIPTS = parsedRes.scriptPile;
      // *** Setting the DOM to our collected HTML

      let cols = document.getElementsByClassName("vertical-flex");

      for(let i=0; i<Object.keys(DOM).length; i++){//Iterating through all dom cols
        if(cols[i]){
          cols[i].innerHTML += DOM[i];
        }
      }

      // *** Appending CSS links to the head

      for(let i=0; i<CSS.local.length; i++){
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS.local[i];
        head.appendChild(link);
      }

      for(let i=0; i<CSS.external.length; i++){
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS.external[i];
        head.appendChild(link);
      }

      //Putting all the external script tags at the top so we can have them before the bottom ones

      for(let i=0; i<SCRIPTS.external.length; i++){
        let script = document.createElement("script");
        script.src = SCRIPTS.external[i];
        head.appendChild(script);
      }

      //Putting all the local script tags at the bottom so they run when everything loads
      const scriptDump = document.getElementById("script-dump");
      for(let i=0; i<SCRIPTS.local.length; i++){
        let script = document.createElement("script");
        script.src = SCRIPTS.local[i];
        scriptDump.appendChild(script);
      }
  }
}
http.open("GET", "http://localhost/moduleHandler");
http.send();
