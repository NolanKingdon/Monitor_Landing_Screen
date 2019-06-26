const Module = require('../Module.js');

//Keep it modular - any time you have a big block of html, make a function for it so you can really break it down
//Reference these files if you want to make a new window or something similar

class Todo extends Module {

  constructor(config){
    super(config);
    console.log(this.config.name + " module load started");
  }

  makeDOM(){
    console.log("Making DOM for "  + this.getName);
    // User code here
    return `
      <section id=${this.getName}>
        <h2 id="todo-section-title">-TODO-</h2>
        <a href="#" id="todo-display-add" onclick="toggleAddInterface()"><h2>+</h2></a>
        <div id="todo-list">
          ${this.createTodoSection("personal")}
          ${this.createTodoSection("hobby")}
          ${this.createTodoSection("school")}
        </div>
        <form id="todo-form">
          <input class="input" type="text" id="todo-title" placeholder="Task"></input>
          <select class="input" id="todo-list-types">
            <option value="personal">Personal</option>
            <option value="school">School</option>
            <option value="hobby">Hobby</option>
          </select>
          <button class="btn" type="reset">lol jk</button>
          <textarea class="input" id="todo-notes" placeholder="Notes"></textarea>
          <input class="input" type="date" id="todo-date"></input>
          <!-- <input type="time" id="todo-time"></input> -->
          <button class="btn" id="todo-add">Add</button>
        </form>
        <form id="todo-edit-form">
          <input class="input" type="text" id="todo-title-edit" placeholder="Task"></input>
          <select class="input" id="todo-list-types-edit">
            <option value="personal">Personal</option>
            <option value="school">School</option>
            <option value="hobby">Hobby</option>
          </select>
          <button class="btn" type="reset" onclick="toggleEditInterface()">lol jk</button>
          <textarea class="input" id="todo-notes-edit" placeholder="Notes"></textarea>
          <input class="input" type="date" id="todo-date-edit"></input>
          <button class="btn" id="todo-edit">Edit</button>
        </form>
      </section>
    `;
  }

  createTodoSection(title){
    let section = `
      <div class="todo-section">
        <div class="todo-section-header" onclick="hideList('${title}')">
          <p id="todo-${title}-head">+</p>
          <p class="todo-section-label todo-closed">${title}</p>
          <p class="todo-section-active" id="todo-${title}-open">0</p>
          <p class="todo-section-next" id="todo-${title}-next"></p>
        </div>
        <div class="todo-section-list" id="todo-${title}-list">
        </div>
      </div>
    `;
    return section;
  }

  defineCSS(){//Return the file name
    console.log("Defining CSS for "  + this.getName);
    let styles = {
        local: [`${this.getName}-styles.css`],
        external: []
    };
    return styles;
  }

  defineScripts(){ // Returns list of all scripts + dirName + js
    // eg. ['timer.js', 'timerColor.js']
    // === ..../modules/timer/js/ + timer.js etc.
    console.log("Loading Scripts list for " + this.getName);
    const scripts = {
      //Will be searched for in the module/js subfolder - To be run in frontent
      //Make your calls to the backend here (Still need to configure the express-server to respond)
      local: ["firebase.js","todos.js"],
      //Will be added in as is. ex: CDNs
      external: []//"https://www.gstatic.com/firebasejs/6.0.0/firebase-app.js", "https://www.gstatic.com/firebasejs/6.0.0/firebase-database.js"]
    }
    return scripts;
  }
}

module.exports = Todo;
