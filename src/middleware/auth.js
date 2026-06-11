// const adminAuth=(req,res,next)=>{
//     console.log("Admin Auth is getting checked");
//     const token='xyz';
//     const isAdminAuthorized = token === 'xyz';
//     if(!isAdminAuthorized){
//         res.status(401).send("Unauthorized: Admin access required")
//     } else {
//         next();
//     }
// };

const jwt=require('jsonwebtoken');
const User=require('../models/User');

const UserAuth=async (req,res,next)=>{
  //read the token from the req cookie
try{ 
     const {token}=req.cookies;
     if(!token){
        // return res.status(401).send("Unauthorized: No token provided");
         }
  const decodedObject=await jwt.verify(token,"DEV@COM$790");
  const {_id}=decodedObject;
  const user=await User.findById(_id);
  if(!user){
    return res.status(404).send("User not found");
  }
  req.user=user;
  next();
} catch(err){
  console.log(err);
  res.status(400).send("Error:Token is invalid!!!!" );
}
  //validate the token
  //find the User
};
module.exports = {
    // adminAuth,
    UserAuth
};
