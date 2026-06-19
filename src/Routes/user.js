const express=require('express');
const userRouter=express.Router();
const {UserAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest')
const User=require('../models/User');

const USER_SAFE_DATA="firstname lastname photoUrl age gender about skills";

//get all the pending connection request for the loggedIn User
userRouter.get("/user/requests/received",UserAuth, async (req, res) => {
   try{
   const loggedInUser=req.user;
   const connectionRequests=await ConnectionRequest.find({
   toUserId:loggedInUser._id,
   status:"interested",
   }).populate('fromUserId',USER_SAFE_DATA);
     res.json({
        message:"Data fetch successfully",
        data:connectionRequests
     })
   }
   catch(err){
     req.statusCode(400).send("error:" +err.message);
   }
});


userRouter.get("/user/connections",UserAuth,async(req,res)=>{
  try{
   const loggedInUser=req.user;
   const connectionRequests=await ConnectionRequest.find({
    $or:[
      {toUserId:loggedInUser._id,status:"accepted"},
      {fromUserId:loggedInUser._id,status:"accepted"},
    ],
   }).populate('fromUserId',USER_SAFE_DATA);

   const data=connectionRequests.map((row)=>{
    if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
      return row.toUserId
    }
    return row.fromUserId;
   });

   res.json({data});
  }
  catch(err){
    res.status(400).send({message:err.message});
  }
})

//feed api
userRouter.get("/feed",UserAuth,async(req,res)=>{
  try{
  //user should see all the user cards except
  //0. his own card
  //1. his connection
  //2. ignored people
  //3. already sent the connection request
  const loggedInUser=req.user;
  const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 10;
    limit=limit>50?50:limit;
    const skip=(page-1)*limit;


  //find all connection requests(sent+received)
  const connectionRequests=await ConnectionRequest.find({
    $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
  }).select("fromUserId toUserId");
  // .populate("fromUserId","firstname")
  // .populate("toUserId","firstname");

   const hideUsersFromFeed = new Set();
   connectionRequests.forEach(req =>{
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());
   });

   const users=await User.find({
    $and:[
      {_id:{$nin:Array.from(hideUsersFromFeed)}},
      {_id:{$ne:loggedInUser._id}},
   // $ne means not equal to
   //$nin means not in this array
    ],
   }).select(USER_SAFE_DATA).skip(skip).limit(limit);
  res.send(users);
  }catch(err){
    res.status(400).json({message:err.message});
  }
})

module.exports=userRouter;
