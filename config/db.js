const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

let isConnected = false;
const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) {
    return console.log("Missing MongoDB URL");
  }

  if (isConnected) {
    return console.log("MongoDB is already Connected");
  }
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Library",
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

module.exports = connectToDB;
