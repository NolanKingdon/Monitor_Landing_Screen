const todoForm = document.getElementById("todo-form");
const submitBtn = document.getElementById('todo-add');
submitBtn.addEventListener("click", stopYourNonsense);
submitBtn.addEventListener("click", handleTaskAdd);
let currentOpenPersonal = 0;
let currentOpenHobby    = 0;
let currentOpenSchool   = 0;
let activeKey = "";


//"Test Title", "Test Notes", "01/01/2001", "1:00PM", "personal"
function resetDatabase(){ // For testing -- Call in console.
  //Reset Metrics
  db.ref('lists/').set({
    completed: {
      completedTotal: 0,
      lastCompleted: 0
    },
    hobby: {
      completedNo: 0,
      // nextDue: 0,
      openNo: 0
    },
    personal: {
      completedNo: 0,
      // nextDue: 0,
      openNo: 0
    },
    school: {
      completedNo: 0,
      // nextDue: 0,
      openNo: 0
    }
  })
  //Reset Open Tasks
  db.ref('openTasks/').set({
    school: [],
    hobby: [],
    personal: [],
    completed: []
  })
}

function stopYourNonsense(e){
  //go home defaults, you're drunk.
  e.preventDefault();
}

function handleTaskAdd(){
  let title = document.getElementById("todo-title").value;
  let notes = document.getElementById("todo-notes").value;
  let date  = document.getElementById("todo-date").value;
  let time  = document.getElementById("todo-time").value;
  let list  = document.getElementById("todo-lists").value;

  let metrics = {};
  let postDate = new Date(); //For post Date
  postDate = postDate.toString();

  db.ref("lists/" + list + "/").once('value')//Reading our current list once to get metrics
  .then(//Reading Current Metrics
    (data) => {
      metrics = data.val();
    }
  )
  .then(//Updating Metrics
    () => {
      //Incrementing our open task number
      metrics.openNo = metrics.openNo + 1;
      //Checking if we have a new closest due date
      if(date < metrics.nextDue || !metrics.nextDue){
        if(date !== ""){
          metrics.nextDue = date;
        }
      }
    }
  )
  .then(//Writing Metrics back
    () => {db.ref("lists/" + list + "/").set(metrics);}
  )
  .then(//Firing The add task for the actual todos
    () => {addTask(title, notes, date, postDate, time, list);}
  )
}

function addTask(title, notes, date, postDate, time, list){
  // -- Adding task to DB && collecting key
  let newKey = db.ref().child('openTasks/' + list + '/').push({
    title,
    notes,
    postDate: postDate,
    dueDate: date,
    dueTime: time,
  }).key;

  activeKey = newKey;
  todoForm.reset();
}

function handleTaskRemove(key, list, type, todoInfo){
/*
  type - Deleted or completed
  todoInfo - Object with all the current todo info in it:
  {
   postDate,
   dueDate,
   dueTime,
   title,
   notes
  }
*/
  let metrics = {};

  db.ref("lists/" + list + "/").once('value')//Reading our current list once to get metrics
  .then(//Reading Current Metrics
    (data) => {
      metrics = data.val();
    }
  )
  .then(//Updating Metrics
    () => {
      //Incrementing our open task number
      metrics.openNo = metrics.openNo - 1;
      //Checking if we have a new closest due date
      if(date < metrics.nextDue){
        metrics.nextDue = date;
      }
    }
  )
  .then(//Writing Metrics back
    () => {db.ref("lists/" + list + "/").set(metrics);}
  )
  .then(//Depending on completion or deletion
    () => {
      if(type === "delete"){
        deleteTask(key, list)
      } else if(type === "complete"){
        completeTask(key, );
      }
    }
  )
}
//IF removed task was next task in metrics - Gotta find a new one

function deleteTask(key, list){
  db.ref('openTasks/' + list + "/" + key).set(null);
}

function completeTask(list, todoInfo){
  //Update metrics as well
}

function addToDOM(title, notes, date, postDate, time, list){
  let todoMarkup = `
    <h2>${title}</h2>
    <p class="todo-list-item-due">${date}</p>
    <p class="todo-list-item-due-time">${time}</p>
    <div class="todo-list-details">
      <p>${notes}</p>
      <p>${postDate}</p>
    </div>`;
  let newItem = document.createElement("div");
  newItem.className = "todo-list-item";
  newItem.id        = activeKey + "::" + list;
  newItem.innerHTML = todoMarkup;

  document.getElementById("todo-" + list + "-list").appendChild(newItem);
}

//Updates our DOM
function watchDB(){
  let snapOpenHobby
  let snapOpenPersonal
  let snapOpenSchool
  //Watch metrics snapshot
  db.ref("lists/").on("value", (snap) => {
    snapOpenHobby    = snap.val().hobby.openNo;
    snapOpenPersonal = snap.val().personal.openNo;
    snapOpenSchool   = snap.val().school.openNo;
//TODO - Find a way around this repetition. AFAIK you can't modify JSON queries.
    //Updating Metrics Headers
    document.getElementById("todo-personal-open").innerHTML = snapOpenPersonal;
    if(snap.val().personal.nextDue) {
      document.getElementById("todo-personal-next").innerHTML = snap.val().personal.nextDue;
    } else {
      document.getElementById("todo-personal-next").innerHTML = "";
    }

    document.getElementById("todo-hobby-open").innerHTML = snapOpenHobby;
    if(snap.val().hobby.nextDue) {
      document.getElementById("todo-hobby-next").innerHTML = snap.val().hobby.nextDue;
    } else {
      document.getElementById("todo-hobby-next").innerHTML = "";
    }

    document.getElementById("todo-school-open").innerHTML = snapOpenSchool;
    if(snap.val().school.nextDue) {
      document.getElementById("todo-school-next").innerHTML = snap.val().school.nextDue;
    } else {
      document.getElementById("todo-school-next").innerHTML = "";
    }
  });
  //watch open tasks snapshot
  db.ref("openTasks/").on("value", (snap) => {
    //Getting initial lengths of all snapshot instances
    let personalDOM = document.getElementById("todo-personal-list").childNodes.length-1;
    let hobbyDOM    = document.getElementById("todo-hobby-list").childNodes.length-1;
    let schoolDOM   = document.getElementById("todo-school-list").childNodes.length-1;

    //If we have one more personal DOM item, add it to the end
    if(personalDOM < snapOpenPersonal){
      //This is chunky and I don't like it - Fix in the future
      let personalKeys = Object.keys(snap.val().personal);
      for(let i=0; i < snapOpenPersonal - personalDOM; i++){
        //Looping until caught up (Solves first load and desync issues)
        let currentSnapChild = snap.val().personal[personalKeys[i+personalDOM]];
        console.log(i+personalDOM);
        console.log(personalKeys);
        activeKey = personalKeys[i+personalDOM];
        addToDOM(currentSnapChild.title,
                  currentSnapChild.notes,
                  currentSnapChild.dueDate,
                  currentSnapChild.postDate,
                  currentSnapChild.dueTime,
                  "personal")
      }
      //Add to DOM
      currentOpenPersonal = snapOpenPersonal;
    }
    if(hobbyDOM < snapOpenHobby){

      let hobbyKeys = Object.keys(snap.val().hobby);
      for(let i=0; i < snapOpenHobby - hobbyDOM; i++){
        //Looping until caught up (Solves first load and desync issues)
        let currentSnapChild = snap.val().hobby[hobbyKeys[i+hobbyDOM]];
        activeKey = hobbyKeys[i+hobbyDOM];
        addToDOM(currentSnapChild.title,
                  currentSnapChild.notes,
                  currentSnapChild.dueDate,
                  currentSnapChild.postDate,
                  currentSnapChild.dueTime,
                  "hobby")
      }
      //Add to DOM
      currentOpenHobby = snapOpenHobby;
    }

    if(schoolDOM < snapOpenSchool){
      let schoolKeys = Object.keys(snap.val().school);
      for(let i=0; i < snapOpenSchool - schoolDOM; i++){
        //Looping until caught up (Solves first load and desync issues)
        let currentSnapChild = snap.val().school[schoolKeys[i+schoolDOM]];
        activeKey = schoolKeys[i+schoolDOM];
        addToDOM(currentSnapChild.title, currentSnapChild.notes, currentSnapChild.dueDate, currentSnapChild.postDate, currentSnapChild.dueTime, "school");
      }
      //Add to DOM
      currentOpenSchool = snapOpenSchool;
    }

  })
}

watchDB();
/*
===========
TESTING
===========
*/

// handleTaskAdd("Test Title", "Test Notes", "01/01/2001", "1:00PM", "personal");
