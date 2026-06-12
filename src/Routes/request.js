const express=require('express');
const requestRouter=express.Router();
const User=require('../models/User');
const {UserAuth}=require('../middleware/auth');

//send connection Request to other user - POST /connect
requestRouter.post('/sendconnectionRequest', UserAuth, async (req, res) => {
  const user=req.user;
   // send connection request to other user
   res.send(user.firstname +" " + "Send the Connection Request");
});


module.exports=requestRouter;