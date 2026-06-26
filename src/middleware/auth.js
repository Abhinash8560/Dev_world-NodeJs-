

const jwt=require('jsonwebtoken');
const User=require('../models/User');

const UserAuth=async (req,res,next)=>{
  //read the token from the req cookie
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    
      const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = decodedObj;

  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  req.user = user;
  next();
} catch (err) {
  console.error(err);
  res.status(401).send("Invalid token");
}
}
module.exports = {
    // adminAuth,
    UserAuth
};
