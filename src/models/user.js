const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
});

// Creating Model
const User = mongoose.model("User", userSchema);

module.exports = User;
