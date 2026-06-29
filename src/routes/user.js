const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["name", "emailId"]); // populating required User collection data
    res.send({ data: connectionRequests });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email");

    const connections = connectionRequests.map((connection) => {
      console.log(
        connection.fromUserId._id.equals(user._id),
        connection.fromUserId._id,
        user._id
      );

      return !connection.fromUserId._id.equals(user._id)
        ? connection.fromUserId
        : connection.toUserId;
    });

    res.send({ data: connections });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

module.exports = userRouter;
