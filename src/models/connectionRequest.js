
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // referance to the User collection
        required:true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // referance to the User collection
        required:true

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{VALUE} is incorrect message status.`
        }
    }
},
{
    timestamps: true
});

// this pre save method will trigger before actual save
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    // check from id is same as to user id
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("can not send connection request to your self !");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;