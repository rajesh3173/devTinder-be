const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token invalid");
    }
    const { _id } = jwt.verify(token, "DEV@TINDER$007");

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User invalid");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

module.exports = { userAuth };
