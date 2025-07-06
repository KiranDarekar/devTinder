const express  = require('express');
const requestRouter  = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const user = require('../models/user');
const { default: mongoose } = require('mongoose');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status  = req.params.status;

        // allowed connection request 
        const allowedStatus = ["ignored", "interested"];
        console.log(!allowedStatus.includes(status));
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "invalid status type: " + status
            })
        }
        // check if user if user is existing 
        const isUserExist = user.findById(toUserId);
        if(!isUserExist) {
            return res.status(404).json({
                message: "User not found!!!"
            })
        }
        // stop dublicate connect request 
        const exisitingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId:fromUserId }
            ],
        });
        if(exisitingConnectionRequest){
            return res.status(400).json({
                message: "Connection request is already present: " + status
            })
        }

        const connectionRequest  = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUserId,
            data
        });
    } catch (error) {
        res.status(400).send("ERROR: "  + error.message);
    }
    
    
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        console.log("login in user -", loggedInUser._id);
        console.log(requestId);
        // allowed connection request 
        const allowedStatus = ["accepted", "rejected"];
        console.log(!allowedStatus.includes(status));
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: " Status is not allowed: " + status
            })
        }
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid request ID" });
        }

        // check the connection in DB request 
        const checkInterestedRequest = await ConnectionRequestModel.findOne({
            _id:requestId,
            toUserId: loggedInUser._id,
            status:'interested'
        }).populate('fromUserId', 'firstName');
        if(!checkInterestedRequest){
            return res.status(400).json({
                message: "Connection request not found: " + status
            })
        }

        // assign the status which we are getting 
        checkInterestedRequest.status = status;
        const data = await checkInterestedRequest.save();
        res.json({
            message: `${req.user.firstName} has ${status} the request from ${checkInterestedRequest.fromUserId.firstName}`,
            data
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
    
});


module.exports = requestRouter;