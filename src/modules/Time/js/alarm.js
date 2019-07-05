//Time looks accessible here - so long as it's loaded after our timer module... No problem then.
let activeAlarms = [];
let today = [];
// Load in DB Connection

function addAlarm(){
  db.ref().child("alarms/").push({
    title: "Test Alarm 2",
    dueTime: "16:37",
    dueDate: "2019-07-10",
    repeats: true,
    notes: "This is a test alarm to see if everything is working."
  });
}

// Load in DB alarms to local storage


// *** Load up functions
function getAlarms(){
  db.ref('alarms/').once("value", (snapshot) => {
    let keys = [];
    let activeAlarmsNoOrder = [];
    for(let i=0; i<Object.keys(snapshot.val()).length; i++){
      keys.push(Object.keys(snapshot.val())[i])
      activeAlarmsNoOrder[i] = {
        key: keys[i],
        dueDate: snapshot.val()[keys[i]].dueDate,
        dueTime: snapshot.val()[keys[i]].dueTime,
        title: snapshot.val()[keys[i]].title,
        notes: snapshot.val()[keys[i]].notes,
        repeats: snapshot.val()[keys[i]].repeats
      }
    }


    // TODO - Make this modular so I can pass in a list of alarms and have it add to today on the fly -- Will be necessary for
    //        adding in alarms from the view
    // Organizing the alarms by time so I don't have to worry about this in the watch function
    for(let i=0; i<activeAlarmsNoOrder.length; i++){ //Looking at each item in our unordered list
      let splitTime = activeAlarmsNoOrder[i].dueTime.split(":");
      let comparisonTime = parseInt(splitTime[0] + splitTime[1]); // Getting an int of the time for comparison
        if(i == 0){ // Always push the first
          activeAlarms.push(activeAlarmsNoOrder[i]); // It doesn't matter where the first is placed
        } else {// For every other run
          let currentLength = activeAlarms.length; //Length of our sorted alarms
          let unplaced = true; // Whether or not we have placed our comparisonTime into the new list
          let count = 0; // Which item of the sorted list are we on

          while(unplaced && count < currentLength){ // Looking at the sortedList so long as we have not placed and are not out of bounds
              let jSplit = activeAlarms[count].dueTime.split(":");
              let jCompare = parseInt(jSplit[0] + jSplit[1]); // The comparison time from the sortedList
              if(comparisonTime < jCompare){//If we have a smaller number, we put it in infront of the sorted value
                activeAlarms.splice(count, 0, activeAlarmsNoOrder[i]);
                unplaced = false; // It has now been placed
              } else if(count == currentLength - 1){
                //If we reach the end of our sorted list and we haven't been smaller than anything,
                //it's obviously the biggest and should go to the end of the list
                activeAlarms.push(activeAlarmsNoOrder[i]);
                unplaced = false; // It has now been placed
              }
              // If we didn't get a successful placement from that element of the sortedList,
              // increment to the next in the sorted list and try again
              // because we break if the count is at the end of the sorted list, this never goes out of bounds
              count ++;
          }
        }
    }
    //Once we have all of our keys
    todaysAlarms();
  });
}

function todaysAlarms(){
  for(let i=0; i<activeAlarms.length; i++){
    if(activeAlarms[i].dueDate == "2019-07-10"){
      today.push(activeAlarms[i]);
    }
  }

  startWatch();
}


/*
  If I have items today, I want to look at the hour and see if there is any alarms today that have that hour.
  If so, I want to see if that alarm is in the next 10 minutes. If not, I wait until the next 10 minutes and check again.

  ex: time right now: 15:15.
      Next alarm:     15:23

      Is the hour the same? Yes. Is the 10 minute the same? No. I want to check again at 15:20. (In 10-current minutes)

  Once We hit an alarm, we start over. Any in the hour? Any in the 10 minute? Any right now?
*/
function startWatch(){
  //This is sorted in the getAlarms method - so we just have to look at the first one in the today list for this comparison
  // for(let i=0; i<today.length; i++){
  //
  //}
}

function checkHours(){
  let todayHold = today[i].dueTime.split(":");
  if(time.hours == todayHold[0]){
    console.log("Same hour");
    //Check every 10 minutes
    if(time.minutes.toString()[0] == todayHold[1][0]){
      console.log("Same 10 minutes");
      //Check every minute
      if(time.minutes == todayHold[1]){
        //Ring the alarm
      }
    } else {
      //Check in the next 10 minutes
    }
  } else {
    //Check in the next hour
  }
}
// Set up scanning algorithm
  // We want to check to make sure there are any in the hour, 10 minutes, and minutes, in that order
  // Also want one initial look when booted up, then maybe snap to a schedule based on the time emit?

// Delete alarms
  // Once complete
  // Once Deleted
  // Not if Recursive (Weekly);

// If recursive alarms, update the next due date in the DOM AND the DB

// Update Alarms - have an edit ability to change times/Titles/Notes/Recursive Status

getAlarms();
