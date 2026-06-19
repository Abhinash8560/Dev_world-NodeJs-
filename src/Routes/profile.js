const express=require('express');
const profileRouter=express.Router();
const User=require('../models/User');
const {UserAuth}=require('../middleware/auth');
const {validateProfileUpdateData}=require('../utils/validation');
const bcrypt = require("bcrypt");


// cookie profile API - GET /profile/view - to get the profile of the logged-in user
profileRouter.get('/profile/view', UserAuth, async (req, res) => {
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


//for updating the profile of the user - PATCH /profile/update
profileRouter.patch('/profile/update', UserAuth, async (req, res) => {
try {
  if(!validateProfileUpdateData(req)){
    throw new Error("Invalid fields in the update request");
  }
  const loggedInUser = req.user;
 Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
 await loggedInUser.save();
 res.json({
   message: `${loggedInUser.firstname} ${loggedInUser.lastname} your profile updated successfully!`,
   data: loggedInUser
 });
}catch(err){
  res.status(400).send(
    "Error occurred while updating user profile: " + err.message
  );
}
});

//for forgot password - PATCH /profile/forgotpassword
profileRouter.post("/forgotpassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;

    await user.save();

    res.json({
      message: "Password updated successfully!"
    });
  } catch (err) {
    res.status(400).send(
      "Error occurred while updating password: " + err.message
    );
  }
});

module.exports=profileRouter;