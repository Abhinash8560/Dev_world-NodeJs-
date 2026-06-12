const express = require('express');
const connectDB=require('./config/database');
const app = express();
const User=require('./models/User');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const authRouter=require('./Routes/auth');
const profileRouter=require('./Routes/profile');
const requestRouter=require('./Routes/request');

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);




//Get User by Email
app.get('/user', async (req, res) => {
  const useremail = req.body.email;
  try{
    const users = await User.find({email: useremail});
      if(users.length === 0){
        return res.status(404).send("User not found");
      }else{
            res.send(users);

      }
    res.send(users);
    } catch (err) {
    res.status(400).send("Error occurred while fetching user"+err.message);
  }
});

//Feed Api -GET/Feed  - get all the users from the database
app.get('/feed', async (req, res) => {
   try{
    const users = await User.find();
    res.send(users);
    } catch (err) {
    res.status(400).send("Error occurred while fetching users"+err.message);
   }
});

//Delete data of the user from the database- DELETE /user
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try{
    const result = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error occurred while deleting user"+err.message);
  }
});

//update data of the user - PATCH /user
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;
  const ALLOWED_UPDATES = ["userId", "photoUrl", "lastname", "gender", "age"];

const isUpdateAllowed = Object.keys(updateData).every((update) => ALLOWED_UPDATES.includes(update));
if(!isUpdateAllowed){
  return res.status(400).send("Invalid updates! Allowed updates are: " + ALLOWED_UPDATES.join(", "));
}
  try{
    const result = await User.findByIdAndUpdate(userId, updateData, {new: true});
    res.send(result);
  } catch (err) {
    res.status(400).send("Error occurred while updating user" + err.message);
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