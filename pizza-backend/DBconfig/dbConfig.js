// dbConfig.js
const mongoose = require("mongoose");
const connectionString = process.env.DB_STRING;
console.log(connectionString, " - connectionString");
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
