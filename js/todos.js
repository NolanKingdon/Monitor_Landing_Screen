const submitBtn = document.getElementById('todo-add');
submitBtn.addEventListener("click", handleTaskAdd);

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
      nextDue: 0,
      openNo: 0
    },
    personal: {
      completedNo: 0,
      nextDue: 0,
      openNo: 0
    },
    school: {
      completedNo: 0,
      nextDue: 0,
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
      if(date < metrics.nextDue || metrics.nextDue === 0){
        metrics.nextDue = date;
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
  //TODO
  //      - Add key to item for future removes
  //        - Add HTML item using a class?

  // -- Adding task to DB && collecting key
  let newKey = db.ref().child('openTasks/' + list + '/').push({
    title,
    notes,
    postDate: postDate,
    dueDate: date,
    dueTime: time,
  }).key;

  // -- Adding HTML to DOM

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

/*
===========
TESTING
===========
*/

// handleTaskAdd("Test Title", "Test Notes", "01/01/2001", "1:00PM", "personal");
