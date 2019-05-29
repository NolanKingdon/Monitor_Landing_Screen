const icons = ["atom", "chrome", "folder", "steam", "intellij", "notepad", "power"];
const section = document.getElementById("launchpad");

function createIconElement(icon){

  let iconElem = document.createElement("a");
  iconElem.className = "launchpad-icon";
  iconElem.id = `launchpad-${icon}`;

  iconElem.addEventListener("click", ()=>{
    let req = new XMLHttpRequest();
    let url = `http://localhost/launchpad?origin=${icon}`;
    req.open('GET', url);
    req.send();
  });

  iconElem.addEventListener("mouseover", (e) => {
    e.target.style.transition = "0.5s";
    e.target.style.height = "75px";
    e.target.style.transform = "translate(0px, -20px)";
  });

  iconElem.addEventListener("mouseout", (e) => {
    e.target.style.transition = "0.3s";
    e.target.style.height = "55px";
    e.target.style.transform = "translate(0px, 0px)";
  });

  let img = document.createElement("img");
  img.className = "launchpad-icon-img";
  img.src = `./images/icons/launchpad/${icon}.png`;

  iconElem.appendChild(img);
  section.appendChild(iconElem);
}

icons.forEach(icon => createIconElement(icon));
