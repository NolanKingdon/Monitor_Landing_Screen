{
  lists: {
    //Top level todo list stats
    //Used for tab display to avoid loading the full tree for everything
    school: {
        openNo: ,       //Number of open tasks
        completedNo: ,    //Number of completed tasks
        nextDue: ,      //Next due task
    },

    hobby: {
        openNo: ,       //Number of open tasks
        completedNo: ,  //Number of completed tasks
        nextDue: ,      //Next due task
    },

    personal: {
        openNo: ,       //Number of open tasks
        completedNo: ,  //Number of completed tasks
        nextDue: ,      //Next due task
    },

    //Top level completed stats
    completed: {
      completedTotal: , //Total completed
      lastCompleted: ,  //Date of last completed task
    }
  },

  open: {
    //trees related to open todos --> Where we actually store the messages
    //Do some research to see if we get ALL the json each time, or individual
    //chunks we can quickload from to save on performance (Only querying what we need)
    school: {
        [
          {
            postDate: ,
            dueDate: ,
            dueTime: ,
            title: ,
            notes: ,
          },
          ...
        ]
    },

    hobby: {
        [
          {
            postDate: ,
            dueDate: ,
            dueTime: ,
            title: ,
            notes: ,
          },
          ...
        ]
    },

    personal: {
        [
          {
            postDate: ,
            dueDate: ,
            dueTime: ,
            title: ,
            notes: ,
          },
          ...
        ]
    },
  }
  
  completed: {
    school: {
      [
        {
          postDate: ,
          dueDate: ,
          dueTime: ,
          title: ,
          notes: ,
        },
        ...
      ]
    },

    hobby: {
      [
        {
          postDate: ,
          dueDate: ,
          dueTime: ,
          title: ,
          notes: ,
        },
        ...
      ]
    },

    personal: {
      [
        {
          postDate: ,
          dueDate: ,
          dueTime: ,
          title: ,
          notes: ,
        },
        ...
      ]
    },

}
