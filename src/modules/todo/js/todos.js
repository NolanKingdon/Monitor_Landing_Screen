const todoForm = document.getElementById("todo-form");
const submitBtn = document.getElementById('todo-add');
const todoEditForm = document.getElementById("todo-edit-form");
const submitEdit = document.getElementById("todo-edit");
submitBtn.addEventListener("click", stopYourNonsense);
submitBtn.addEventListener("click", handleTaskAdd);
submitEdit.addEventListener("click", stopYourNonsense);
submitEdit.addEventListener("click", sendEdit);
let currentOpenPersonal = 0;
let currentOpenHobby    = 0;
let currentOpenSchool   = 0;
let activeKey = "";
let activeList = ""; // Used for edits


//"Test Title", "Test Notes", "01/01/2001", "1:00PM", "personal"
// function resetDatabase(){ // For testing -- Call in console.
//   //Reset Metrics
//   db.ref('lists/').set({
//     completed: {
//       completedTotal: 0,
//       lastCompleted: 0
//     },
//     hobby: {
//       completedNo: 0,
//       // nextDue: 0,
//       openNo: 0
//     },
//     personal: {
//       completedNo: 0,
//       // nextDue: 0,
//       openNo: 0
//     },
//     school: {
//       completedNo: 0,
//       // nextDue: 0,
//       openNo: 0
//     }
//   })
//   //Reset Open Tasks
//   db.ref('openTasks/').set({
//     school: [],
//     hobby: [],
//     personal: [],
//     completed: []
//   })
// }

function stopYourNonsense(e){
  //go home defaults, you're drunk.
  e.preventDefault();
}

function handleTaskAdd(){
  toggleAddInterface();//Hiding the add interface when we're done
  let title = document.getElementById("todo-title").value;
  let notes = document.getElementById("todo-notes").value;
  let date  = document.getElementById("todo-date").value;
  let time  = "undefined" //document.getElementById("todo-time").value;
  let list  = document.getElementById("todo-list-types").value;

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
      //Checking if we have a new closest due date -- TAKEN OUT FOR NOW -- NEED A BETTER SYSTEM FIRST
      // if(date < metrics.nextDue || !metrics.nextDue){
      //   if(date !== ""){
      //     metrics.nextDue = date;
      //   }
      // }
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
    dueDate : date,
    dueTime : time,
  }).key;

  activeKey = newKey;
  todoForm.reset(); // Taking out our values from the add
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
        completeTask(list, key);
      }
    }
  )
}
//IF removed task was next task in metrics - Gotta find a new one

function deleteTask(list, key){
  //Write to completed here first -- TODO ---------------------------------------------------
  //  Maybe set reference to below (list + key) and copy it to the completed tree and THEN set null
  //Deleting from open tasks
  db.ref('openTasks/' + list + "/" + key).set(null);
  //Deleting our domNode
  let domNode = document.getElementById(key + "::" + list);
  domNode.remove();
}

function completeTask(list, key){
  //Update metrics as well
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
      metrics.openNo = metrics.openNo - 1;
      metrics.completedNo = metrics.completedNo + 1;
    }
  )
  .then(//Writing Metrics back
    () => {
      db.ref("lists/" + list + "/").set(metrics);
      //Increment the completed metrics here too -- TODO ------------------------------------
    }
  )
  .then(//Firing The add task for the actual todos
    () => {deleteTask(list, key);}
  )
}

function addToDOM(title, notes, date, postDate, time, list){
  let todoMarkup = `
    <h2>${title}</h2>
    <p class="todo-list-item-due">${date}</p>
    <!--<p class="todo-list-item-due-time">${time}</p>-->
    <div class="todo-list-item-btn">
    <button class="btn todo-btn" onclick="completeTask('${list}', '${activeKey}')"><img src="../modules/Todo/images/white-check-mark-hi.png"/></button>
    <button class="btn todo-btn" onclick="editTask('${list}', '${activeKey}')"><img src="../modules/Todo/images/white-pencil-icon.png"/></button>
    </div>
    <div class="todo-list-details">
      <p>${notes}</p>
     <!--<p>${postDate}</p>-->
    </div>`;
  let newItem = document.createElement("div");
  newItem.className = "todo-list-item";
  newItem.id        = activeKey + "::" + list;
  newItem.innerHTML = todoMarkup;
  newItem.onclick   = (e) => {toggleItemDetails(e)}
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
//For hiding the list items of each header
function hideList(listType){
  let list = document.getElementById("todo-" + listType + "-list");
  let head = document.getElementById("todo-" + listType + "-head");
  if(list.style.display === "none" || list.style.display === ""){
    list.style.display = "block";
    head.innerHTML = "-";
  } else if(list.style.display === "block"){
    list.style.display = "none";
    head.innerHTML = "+";
  }
}
//Hides ability to add tasks
function toggleAddInterface(){
  if(todoForm.style.display === "none" || todoForm.style.display === ""){
    todoForm.style.display = "grid";
  } else {
    todoForm.style.display = "none";
  }
}

function toggleEditInterface(){
  if(todoEditForm.style.display === "none" || todoEditForm.style.display === ""){
    todoEditForm.style.display = "grid";
  } else {
    todoEditForm.style.display = "none";
  }
}

function toggleItemDetails(e){
  //Checking the path and displaying/hiding the notes dependant
  //NOTE - This will also fire when clicking on the "Done" button.
  //TODO - fix this later
  //I am so sorry, future self. It wouldn't work if I assigned these to variables
  if(
    e.path[1].childNodes[9].style.display === "" ||
    e.path[1].childNodes[9].style.display === "none"
    )
  {
    e.path[1].childNodes[9].style.display = "block";
  }
  else
  {
    e.path[1].childNodes[9].style.display = "none";
  }
}

function editTask(list, editKey){
  activeKey = editKey; // Assigning our activeKey to the key we want to edit
  activeList = list;
  db.ref('openTasks/' + list + "/" + activeKey).once('value') //Querying DB
    .then(
      (res) => {
        // updating the edit fields
        let data = res.val();
        todoEditForm.childNodes[1].value = data.title;
        todoEditForm.childNodes[3].value = list;
        todoEditForm.childNodes[7].value = data.notes;
        if(data.dueDate !== ""){todoEditForm.childNodes[9].valueAsNumber = data.dueDate;}
      }
    )
  //Showing the edit fields
  toggleEditInterface();
}

function sendEdit(){
  let DOMItem = document.getElementById(`${activeKey}::${activeList}`);

  let title = todoEditForm.childNodes[1].value;
  let list  = todoEditForm.childNodes[3].value;
  let notes = todoEditForm.childNodes[7].value;
  let date  = todoEditForm.childNodes[9].value;

  DOMItem.childNodes[1].innerHTML = title;
  DOMItem.childNodes[3].innerHTML = date;
  DOMItem.childNodes[9].innerHTML = notes;
  // DOMItem.childNodes[7]
  // DOMItem.childNodes[3].

  db.ref('openTasks/' + list + "/" + activeKey).set({
    dueDate: date,
    dueTime: "",
    notes: notes,
    title: title,
    postDate: new Date()
  });

  console.log(title, list, notes, date);

  toggleEditInterface();
  activeKey = ""; // Don't want any wires crossing here
}

watchDB();
/*
===========
TESTING
===========
*/

// handleTaskAdd("Test Title", "Test Notes", "01/01/2001", "1:00PM", "personal");
