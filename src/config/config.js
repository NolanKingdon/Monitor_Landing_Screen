let config = {
  core: { //For the main electron window
    height: "",
    width: "",
  },
  modules: [
    {
      name: "Test",
      location: "right", //Which column
      config: {
        "":"" // Going to have things like keys, customization options, etc.
      }
    }
  ]
};

module.exports = config;
