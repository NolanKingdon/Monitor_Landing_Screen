// All of our Tasks
let activeAlarms = [];
// All of our tasks due today
let today = [];
// Using this as the on time to determine if alarm times are valid or will cause errors further down the line
let onTime = new Date();
// Using a ternary to assign the 0 if the length is 1 or less. This shouldn't effect top of the hours (4:00) because 0 is 0.
console.log(onTime.getMinutes().toString().length);
onTime = onTime.getHours().toString() + (onTime.getMinutes().toString().length > 1 ? onTime.getMinutes().toString() : "0" + onTime.getMinutes().toString());
onTime = parseInt(onTime);
// Have a minute interval variable out here to prevent local scope in the interval to create exponential calls
let minuteInterval;
let tenInterval;
let hourInterval;

// Load in DB Connection
function addAlarm(time){
  db.ref().child("alarms/").push({
    title: "Test Alarm 1",
    dueTime: time,
    dueDate: "2019-07-22",
    repeats: true,
    notes: "This is a test alarm to see if everything is working."
  });
}

// *** Load up functions
function getAlarms(){
  db.ref('alarms/').once("value", (snapshot) => {
    let keys = [];
    let activeAlarmsNoOrder = [];
    let validTimes = 0;

    for(let i=0; i<Object.keys(snapshot.val()).length; i++){
      keys.push(Object.keys(snapshot.val())[i])

      let splitTime = snapshot.val()[keys[i]].dueTime.split(":");
      let comparisonTime = parseInt(splitTime[0] + splitTime[1]);
      console.log("Comparison Time:" + comparisonTime);
      console.log("On Time: " + onTime);
      if(comparisonTime > onTime){
        activeAlarmsNoOrder[validTimes] = {
          key: keys[i],
          dueDate: snapshot.val()[keys[i]].dueDate,
          dueTime: snapshot.val()[keys[i]].dueTime,
          title: snapshot.val()[keys[i]].title,
          notes: snapshot.val()[keys[i]].notes,
          repeats: snapshot.val()[keys[i]].repeats
        }
        validTimes++;
      } else {
        //Remove them now from the DB because we don't really need them
      }
    }
    console.log(activeAlarmsNoOrder);

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
    console.log(activeAlarms);
    //Once we have all of our keys
    todaysAlarms();
  });
}

function todaysAlarms(){
  console.log(activeAlarms);
  for(let i=0; i<activeAlarms.length; i++){
    if(activeAlarms[i].dueDate == `2019-07-22`){ // TODO - figure out how to check the date without calling the time AGAIN
      today.push(activeAlarms[i]);
    }
  }
  console.log(today);
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
  // Consider checking for the current time when booted up so we don't miss any alarms and fuck everything up
    time.hours = time.hours.toString();
    time.minutes = time.minutes.toString();
    let todayHold = today[0].dueTime.split(":");
    console.log("Starting Watch");

    if(time.hours.length < 2){
      console.log("Fixing the hours to be double digit");
      time.hours = "0" + time.hours.toString()
    }
    if(time.minutes.length < 2){
      console.log("Fixing minutes to double digit");
      time.minutes = "0" + time.minutes.toString();
    }

    if(time.hours == todayHold[0]){ // Checking hours
      console.log("Same hour");
      //Check every 10 minutes
      if(time.minutes.toString()[0] == todayHold[1][0]){ // Checking 10 minutes
        console.log("Same 10 minutes");
        //Check every minute
        if(time.minutes == todayHold[1]){ // Checking Minutes
          clearAllIntervals();
          console.log("Ring the alarm");
          //Ring the alarm
          console.log(today);
          today.shift();
          console.log(today);

          // TODO
              // Delete the alarm
                // Out of DB if non-recursive

          startWatch();
        } else {
          clearAllIntervals();
          console.log("Setting 1 minute interval");
          let nextMin = new Date().getSeconds();
          nextMin = 60-nextMin;
          minuteInterval = setInterval(startWatch, nextMin*1000);
        }
      } else {
        console.log("Setting 10 minute interval");
        //clear 10 minute interval
        clearAllIntervals();
        //Check in the next 10 minutes
        let nextTen = new Date().getMinutes();
        nextTen = (60 - nextTen)%10; //Minutes until next 10 minute period -%10 ensures that no matter what we're at (23, 33, 43) it only waits for the minutes (3)
        tenInterval = setInterval(startWatch, nextTen*60000); // Multiplying the number of minutes by a minite in milliseconds
      }
    } else {
      console.log("Checking the next hour");
      //Clearing old listener
      clearAllIntervals();
      //Check in the next hour
      let nextHour = new Date().getMinutes();
      nextHour = 60 - nextHour;
      hourInterval = setInterval(startWatch, nextHour*60000);
    }
}
function clearAllIntervals(){
  // If we have any intervals, they're getting cleared. Important for when we have rollover checks.
  /*
    EXAMPLE:

      -   First alarm at 5:01, check runs at 4:51 -> Going to check in on the next hour. Then going to identify we're in a minute.
    This skips the clear for the hour if we do it this way. Ergo, we just call this function everytime we want to clear them,
    and it should do the decisions by itself.
  */
  if(hourInterval){clearInterval(hourInterval);}
  if(tenInterval){clearInterval(tenInterval);}
  if(minuteInterval){clearInterval(minuteInterval);}
}



// TODO -----------------------------------------------------------------------
// Set up scanning algorithm
  // We want to check to make sure there are any in the hour, 10 minutes, and minutes, in that order
  // Also want one initial look when booted up, then maybe snap to a schedule based on the time emit?

// Delete alarms
  // Once complete
  // Once Deleted
  // Not if Recursive (Weekly);
  // Once irrelevant (Missed Alarms)

// If recursive alarms, update the next due date in the DOM AND the DB

// Update Alarms - have an edit ability to change times/Titles/Notes/Recursive Status

getAlarms();
