const mongoose = require('mongoose');



require("dotenv").config();
const connectDB = async () => {
  try{

    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  }catch(error){
    console.log("In error block:::::")
    console.log("error:::::",error)
  }
};

module.exports = connectDB;
