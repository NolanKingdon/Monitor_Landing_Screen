const icons = ["atom", "chrome", "folder", "steam", "intellij", "notepad", "power"];
const section = document.getElementById("Launchpad");

function createIconElement(icon){

  let iconElem = document.createElement("a");
  iconElem.className = "launchpad-icon";
  iconElem.id = `launchpad-${icon}`;

  if(icon != "power"){ // Our normal icons
    sendReq(icon, iconElem);//Just send the request for normal icons
  } else if (icon == "power"){// Load confirmation icon with poweroff command
    // *** Creating the shutdown confirm icon
    let shutDownConfirm = document.createElement("a");
    shutDownConfirm.className = "launchpad-icon";
    shutDownConfirm.id = "shutdown-confirm";
    shutDownConfirm.style.display = "none"; //Initially does not display

    // *** Adding our questionmark for the confirm button
    let pImg = document.createElement("img");
    pImg.className = "launchpad-icon-img";
    pImg.src = `../modules/Launchpad/images/questionmarkv2.png`;

    //*** Appending the items together
    shutDownConfirm.appendChild(pImg);
    sendReq(icon, shutDownConfirm); // Appending our command back
    addListeners(shutDownConfirm); // Appending our mouseovers
    section.appendChild(shutDownConfirm);

    //*** Clicking the new icon
    iconElem.addEventListener("click", () =>{
      let confirm = document.getElementById("shutdown-confirm");
      confirm.style.display = "block"; // Invert the displays so we see the confirm icon
      iconElem.style.display = "none";

      //Displaying our change for 10 seconds before reverting back
      window.setTimeout( () => {
          shutDownConfirm.style.display = "none";
          iconElem.style.display = "block";
      }, 10000);
    });
  }

  //***Adding our image to the initial icons
  let img = document.createElement("img");
  img.className = "launchpad-icon-img";
  img.src = `../modules/Launchpad/images/${icon}.png`;

  // *** Adding listeners to inital icons
  addListeners(iconElem);
  iconElem.appendChild(img);
  section.appendChild(iconElem);
}

function sendReq(icon, iconElem){ //Sends the request to our node server to execute the command
  iconElem.addEventListener("click", ()=>{
    let req = new XMLHttpRequest();
    let url = `http://localhost/launchpad?origin=${icon}`;
    req.open('GET', url);
    req.send();
  });
}

function addListeners(item){ // Adds the mouseover/mouseout listeners to the icons
  item.addEventListener("mouseover", (e) => {
    e.target.style.transition = "0.5s";
    e.target.style.height = "75px";
    e.target.style.transform = "translate(0px, -20px)";
  });

  item.addEventListener("mouseout", (e) => {
    e.target.style.transition = "0.3s";
    e.target.style.height = "55px";
    e.target.style.transform = "translate(0px, -5px)";
  });
}
// *** Creating our icons
icons.forEach(icon => createIconElement(icon));
