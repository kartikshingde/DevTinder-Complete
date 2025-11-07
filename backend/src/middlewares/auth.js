const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ 
        error: "Authentication required",
        message: "Please Login!" 
      });
    }

    const decodedObj = await jwt.verify(token, "dont@writeByYourself#");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    
    if (!user) {
      return res.status(401).json({ 
        error: "User not found",
        message: "Please Login again!" 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ 
      error: "Authentication failed",
      message: err.message 
    });
  }
};

module.exports = { userAuth };