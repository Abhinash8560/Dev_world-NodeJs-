const express=require('express');
const profileRouter=express.Router();
// const User=require('../models/User');
const {UserAuth}=require('../middleware/auth');
const {validateProfileUpdateData}=require('../utils/validation');


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

module.exports=profileRouter;