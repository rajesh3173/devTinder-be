const express = require("express");
const { userAuth } = require("../middlewares/auth");

const notificationRouter = express.Router();

// Store connected client response objects to broadcast notifications later
let clients = [];

notificationRouter.get("/events", userAuth, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial connection success message. Format must start with "data: " and end with "\n\n"
  res.write('data: {"message": "Connected to notification stream"}\n\n');
  // Save this client's response object to our active pool
  clients.push(res);

  // If the user closes their browser or tab, clean up and remove them from our pool to prevent memory leaks
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
    res.end();
  });
});

notificationRouter.post("/send-notification", userAuth, (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).send("Notification message required");
  }

  const payload = {
    id: Date.now(),
    text: text,
    timestamp: new Date().toLocaleDateString(),
  };

  // Loop through all connected clients and push the new data down their existing connections
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
  console.log(clients);

  res.json({ data: "sent" });
});

module.exports = notificationRouter;
