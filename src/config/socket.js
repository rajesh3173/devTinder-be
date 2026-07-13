const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ name, toUserId, userId }) => {
      const roomId = [toUserId, userId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ text, toUserId, userId, name }) => {
      try {
        const roomId = [toUserId, userId].sort().join("_");

        let chat = await Chat.findOne({
          participants: { $all: [userId, toUserId] },
        });

        if (!chat) {
          chat = new Chat({ participants: [userId, toUserId], messages: [] });
        }
        chat.messages.push({ senderId: userId, text: text });
        await chat.save();

        io.to(roomId).emit("messageReceived", { text, name });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
