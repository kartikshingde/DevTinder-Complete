const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // ✅ Check if already connected
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing database connection");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");

    // ✅ Add timeout options and other recommended settings
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering for serverless
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;