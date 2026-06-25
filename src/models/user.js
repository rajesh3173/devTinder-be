const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 100,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about",
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

// Creating Model
const User = mongoose.model("User", userSchema);

module.exports = User;
