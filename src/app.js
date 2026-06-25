const express = require("express");
const { connectDb } = require("./config/database");
const validator = require("validator");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating user instance of User model
  const user = new User(req.body);

  const isEmailValid = validator.isEmail(req.body.emailId);

  if (!isEmailValid) {
    res.status(400).send("invalid email");
  }

  try {
    // saving data in DB
    await user.save();
    res.send("user added successfully...!");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error saving user: " + error.message);
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
    console.log("user", user);

    res.send("user data updated");
  } catch (error) {
    console.log(error);

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
