const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const user = req.user;
    const connctionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUserIds = new Set();
    connctionRequests.forEach((req) => {
      hideUserIds.add(req.fromUserId.toString());
      hideUserIds.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserIds) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select("name emailId about")
      .skip(skip)
      .limit(limit);

    res.send({ data: userFeed });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

module.exports = userRouter;
