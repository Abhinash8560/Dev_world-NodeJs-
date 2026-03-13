const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Abhi:node1@cluster0.qnrvxcy.mongodb.net/DevWorld");
    console.log("Database Connected");
  } catch (err) {
    console.log("Database Connection Failed", err);
  }
};

connectDB(); 

module.exports = connectDB;
