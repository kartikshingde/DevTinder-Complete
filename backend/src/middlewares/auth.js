// middleware/userAuth.js - Updated
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header instead of cookies
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please Login!",
      });
    }

    // Extract token after "Bearer "
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please Login!",
      });
    }

    const decodedObj = await jwt.verify(token, "dont@writeByYourself#");
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        message: "Please Login again!",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      error: "Authentication failed",
      message: err.message,
    });
  }
};

module.exports = { userAuth };
