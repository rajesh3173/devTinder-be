const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const isEmailValid = validator.isEmail(req.body.emailId);

    if (!isEmailValid) {
      res.status(400).send("invalid email");
    }

    // hash function has 1st org is plain password and 2nd org is saltRounds
    // more the salt number, more encryption
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // creating user instance of User model
    const user = new User({ ...req.body, password: passwordHash });

    // saving data in DB
    await user.save();
    res.send("user added successfully...!");
  } catch (error) {
    res.status(500).send("Error saving user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();

      res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 });
      res.send("login success");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfull..!");
});

module.exports = authRouter;
