const adminAuth=(req,res,next)=>{
    console.log("Admin Auth is getting checked");
    const token='xyz';
    const isAdminAuthorized = token === 'xyz';
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized: Admin access required")
    } else {
        next();
    }
};
const UserAuth=(req,res,next)=>{
    console.log("UserAuth is getting checked");
    const token='xyz';
    const isAdminAuthorized = token === 'xyz';
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized: User access required")
    } else {
        next();
    }
};
module.exports = {
    adminAuth,
    UserAuth
};
