const express = require('express');
const connectDB=require('./config/database');
const app = express();
const User=require('./models/User');
const {valiadateSignUpData}=require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const {UserAuth}=require('./middleware/auth');
app.use(express.json());
app.use(cookieParser());

// SignUp API - POST /signup - to create a new user in the database
app.post('/signup', async (req, res) => {
  //validation of data
  try {
    valiadateSignUpData(req);
  } catch (error) {
    return res.status(400).send(error.message);
  }
const { firstname, lastname, email, password } = req.body;
  // Creating a new instance of the User Model
  const user = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password
  });
  try{
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error occurred while signing up user"+err.message);
  }
});

//login API - POST /login - to authenticate a user and provide access to the application
app.post('/login', async (req, res) => {

  try {
      const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("Password Match:", isPasswordValid);
    console.log("Entered Password:", password);
    console.log("Stored Password:", user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }
// create jwt token
    const token = await user.getJWT();


//Add the token to cookiee and send the response back to the user

    res.cookie("token", token, { httpOnly: true });
    res.send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
 
});

// cookie profile API - GET /profile - to get the profile of the logged-in user
app.get('/profile', UserAuth, async (req, res) => {
  try {
   const user = req.user;
 
    // Send user profile
    res.send(user);

  } catch (err) {
    res.status(400).send(
      "Error occurred while fetching user profile: " + err.message
    );
  }
});

//send connection Request to other user - POST /connect
app.post('/sendconnectionRequest', UserAuth, async (req, res) => {
  const user=req.user;
   // send connection request to other user
   res.send(user.firstname +" " + "Send the Connection Request");
});


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