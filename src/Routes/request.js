const express=require('express');
const requestRouter=express.Router();
const ConnectionRequest=require('../models/connectionRequest');
const {UserAuth}=require('../middleware/auth');
const User=require('../models/User');

//send connection Request to other user - POST /connect
requestRouter.post('/request/send/:status/:toUserId', UserAuth, async (req, res) => {
  try{
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({error:`Invalid status type: ${status}`});
    }

    // if()

// if the user not exist in our database then return error
const toUser=await User.findById(toUserId);
if(!toUser){
  return res.status(404).json({error:"User not found!"});
}
const existingConnectionRequest=await ConnectionRequest.findOne({
 $or:[
  {fromUserId:fromUserId, toUserId:toUserId},
  {fromUserId:toUserId, toUserId:fromUserId}
 ],
});



if(existingConnectionRequest){
  return res.status(400).json({error:"Connection request already sent!"});
}



const connectionRequest=new ConnectionRequest({
    fromUserId,
    toUserId,
    status
  });

  const data = await connectionRequest.save();
  res.json({
    message: req.user.firstname + " is " + status + " in " + toUser.firstname,
    data,
  })
} catch(err) {
  res.status(400).send({error:err.message});
}
});

    // - Post/request/review/:status/:requestId
    requestRouter.post('/request/review/:status/:requestId', UserAuth, async (req, res) => {
        try{
          const loggedInUserId=req.user;
          const {status,requestId} = req.params;
          const allowedStatus=["accepted","rejected"];
          if(!allowedStatus.includes(status)){
            return res.status(400).json({error:`Invalid status type: ${status}`});
          }
          const connectionRequest=await ConnectionRequest.findOne({ _id: requestId,toUserId:loggedInUserId._id,status:"interested"})
          if(!connectionRequest){
            return res.status(404).json({error:"Connection request not found!"});
          }
          if(connectionRequest.toUserId.toString()!==loggedInUserId._id.toString()){
            return res.status(403).json({error:"You are not authorized to perform this action!"});
          }

          connectionRequest.status=req.params.status;
          await connectionRequest.save();

          res.json({message:"Connection request "+req.params.status+" successfully!"});
          // validate the user

          //loggedIn  == toUserId
          //status = interested
          //request Id should be valid


        }
        catch(err){
          res.status(400).send({error:err.message});
        }
    });



module.exports=requestRouter;