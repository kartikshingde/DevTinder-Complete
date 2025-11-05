const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = 0; // 0: disconnected, 1: connected

const connectDB = async () => {
  if (isConnected) return; // Reuse existing connection (important for serverless)

  const url = process.env.MONGO_URI;
  if (!url) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    await mongoose.connect(url);
    isConnected = 1;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
