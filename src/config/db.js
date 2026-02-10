const mongoose = require('mongoose');
const cronJobs = require('../../src/utils/cronJobs');


require("dotenv").config();
const connectDB = async () => {
  console.log("connectDB===")
  console.log("connectDB===")
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  console.log("connectDB222222===")
  await mongoose.connect(process.env.MONGO_URI, {
    // options are defaults in mongoose 7+
  });

   cronJobs.startAll();
  console.log('MongoDB connected');
};

module.exports = connectDB;
