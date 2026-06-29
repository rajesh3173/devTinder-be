const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      throw new Error("invalid status");
    }

    const toUserIdDetails = await User.findById(toUserId);

    if (!toUserIdDetails) {
      throw new Error("user not valid");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("connection request already exit..!");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await connectionRequest.save();
    res.send(`${status} request saved successfully`);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

requestRouter.post("/review/:status/:requistId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requistId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("invalid status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requistId,
      status: "interested",
      toUserId: loggedInUser._id,
    });

    if (!connectionRequest) {
      res.status(404).send("connection request not found");
    }
    connectionRequest.status = status;
    await connectionRequest.save();

    res.send(`Connection request ${status}`);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = requestRouter;
