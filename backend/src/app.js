// const express = require("express");
// const connectDB = require("./config/database");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const app = express();

// // Middlewares
// app.use(
//   cors({
//     origin: [
//       "https://devconnectbykartik.netlify.app",
//       "https://dev-tinder-complete-2spw.vercel.app",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // Health check route
// app.get("/", (req, res) => {
//   res.json({ message: "API is running", status: "OK" });
// });

// // Routers
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");
// const s3Router = require("./routes/s3Router");

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", s3Router);

// // ✅ Connect DB and start server
// const PORT = process.env.PORT || 3000;

// connectDB()
//   .then(() => {
//     console.log("✅ Database connection established");

//     // ✅ Start listening on port
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   });

// // Export for testing purposes (optional)
// module.exports = app;

// authRouter.js
const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("./utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const isProduction = process.env.NODE_ENV === "production";

// Cookie configuration based on environment
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction, // true in production
  sameSite: isProduction ? "none" : "lax", // "none" required for cross-origin in production
  maxAge: 8 * 3600000, // 8 hours
  path: "/",
});

authRouter.post("/signup", async (req, res) => {
  try {
    // validate user
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    //Encrypt pass
    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPass,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, getCookieOptions());

    res.json({ message: "User Added successfully!", data: savedUser });
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
      // Create a jwt token
      const token = await user.getJWT();

      // Add the token to cookie and send the response back to the User
      res.cookie("token", token, getCookieOptions());

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    ...getCookieOptions(),
    maxAge: 0,
  });
  res.send("LogOut Successful!!");
});

module.exports = authRouter;