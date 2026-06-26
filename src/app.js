const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/database");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const jwtSecret = "DEV@TINDER$007";

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

      res.cookie("token", token);
      res.send("login success");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body.data;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("user data updated");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

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
