const express = require("express");
const connectDB = require("./config/database");
const app = express();

const cors=require("cors")
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

// Ensure DB connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).send("Database connection failed");
  }
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const  s3Router  = require("./routes/s3Router");

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)
app.use("/",s3Router)

// Export for Vercel; don't listen here
module.exports = app;