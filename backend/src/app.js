const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running", status: "OK" });
});

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const s3Router = require("./routes/s3Router");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", s3Router);

// Connect DB
connectDB()
  .then(() => console.log("✅ Database connection established"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = app;