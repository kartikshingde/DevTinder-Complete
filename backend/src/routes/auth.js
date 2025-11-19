// authRouter.js - Updated
const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPass,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // Remove res.cookie() - Send token in response body
    res.json({
      message: "User Added successfully!",
      data: savedUser,
      token: token, // Add token to response
    });
  } catch (err) {
    res.status(400).send("Some Error Occured " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // Remove res.cookie() - Send token in response body
      res.json({
        user: user,
        token: token, // Add token to response
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // No need to clear cookie - client handles localStorage
  res.send("LogOut Successful!!");
});

module.exports = authRouter;
