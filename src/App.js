const express = require('express');
const connectDB=require('./config/database');
const app = express();
const User=require('./models/User');

app.post('/signup', async (req, res) => {

  const user = new User({
    firstname:"Suresh",
    lastname:"singh",
    password:"657",
    email:"Suresh@example.com",
    gender:"Male",
    _id:"654321"
  });
  try{
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error occurred while signing up user");
  }
});


connectDB()
.then(()=>{
  console.log("Db connection established");
  
// require('./config/database');
// const {adminAuth,UserAuth}=require('./middleware/auth');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
})
.catch((err)=>{
  console.log("Db connection failed",err);
});