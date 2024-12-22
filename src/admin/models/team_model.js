const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  teamImage: {
    type: String,
   
  },
  links: {
    type: [String], // Expecting an array of strings
    required: true,
  },
});

const MyTeam = mongoose.model("Team", teamSchema);

module.exports = MyTeam;
