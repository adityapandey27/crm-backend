const mongoose = require('mongoose');
const cronJobs = require('../../src/utils/cronJobs');

const connectDB = async (uri) => {
  console.log("connectDB===")
  console.log("connectDB===")
  if (!uri) throw new Error('MONGO_URI is required');
  console.log("connectDB222222===")
  await mongoose.connect(uri, {
    // options are defaults in mongoose 7+
  });

   cronJobs.startAll();
  console.log('MongoDB connected');
};

module.exports = connectDB;
