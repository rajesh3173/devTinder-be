const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
// const cron = require("node-cron");
const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const notificationRouter = require("./routes/notifications");
const initializeSocket = require("./config/socket");

const app = express();

// cron.schedule("* * * * *", () => {
//   console.log("hello ", new Date());
// });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/notifications", notificationRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDb()
  .then(() => {
    console.log("databse connection established...!");
    server.listen(8080, () => {
      console.log("Server is listening on port 8080....");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected...!!!", err);
  });
