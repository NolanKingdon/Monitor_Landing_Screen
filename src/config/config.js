let config = {
  core: { //For the main electron window
    height: "",
    width: "",
  },
  modules: [
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
  ]
};

module.exports = config;
