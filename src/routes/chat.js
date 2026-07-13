const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/messages/:toUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { toUserId } = req.params;
    const chat = await Chat.findOne({
      participants: { $all: [userId, toUserId] },
    }).populate({ path: "messages.senderId", select: "name emailId" });
    if (!chat) {
      res.send([]);
    } else {
      res.send(chat.messages);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
