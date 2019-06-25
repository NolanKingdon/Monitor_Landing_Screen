let config = {
  core: { //For the main electron window
    height: "",
    width: "",
  },
  modules: [
    {
      name: "Launchpad",
      location: 0, //Which column - 0, 1, 2 ...
      config: {
        "":"" // Going to have things like keys, customization options, etc.
      }
    },
    {
      name: "Timer",
      location: 1, //Which column - 0, 1, 2 ...
      config: {
        "":"" // Going to have things like keys, customization options, etc.
      }
    },
    {
      name: "Hexclock",
      location: 1, //Which column - 0, 1, 2 ...
      config: {
        "":"" // Going to have things like keys, customization options, etc.
      }
    },
    {
      name: "Sys-info",
      location: 1,
      config: {
        "":""
      }
    }
  ]
};

module.exports = config;
