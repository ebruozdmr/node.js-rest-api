const mongoose = require("mongoose");

// const URI = process.env.URI;

const connectDB = async () => {
  try {
    // console.log(process.env.DB_URI);
    await mongoose.connect(process.env.DB_URI);
    // await mongoose.connect(URI);
    console.log("Connected to database!");
  } catch (error) {
    console.log(error.message);
    // throw new Error(`Connection failed:${error.message}`);
  }
};

module.exports = connectDB;
