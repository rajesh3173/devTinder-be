const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectDb()
  .then(() => {
    console.log("databse connection established...!");
    app.listen(8080, () => {
      console.log("Server is listening on port 8080....");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected...!!!", err);
  });
