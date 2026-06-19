const mongoose=require('mongoose');
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', //reference to the user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:{values:['ignored',"interested",'accepted','rejected'], message:`{VALUE} is incorrect status type`},
        default:'pending'
    }
},{timestamps:true});

//connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});
connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});



//every time we call save method then presave will be called
connectionRequestSchema.pre('save',async function(next){
    const connectionRequest=this;
    //check if the fromUser Id is same as toUserId
     if(connectionRequest.fromUserId.equals (connectionRequest.toUserId)){
        throw new Error('You cannot send a connection request to yourself!');
    }
    // next();
});

const ConnectionRequestModel= new mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports=ConnectionRequestModel;