const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("env", process.env.DOT_ENV);

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/user", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userDataToUpdate = req.body;

    Object.keys(userDataToUpdate).forEach((key) => {
      loggedInUser[key] = userDataToUpdate[key];
    });

    await loggedInUser.save();
    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});

profileRouter.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = profileRouter;
