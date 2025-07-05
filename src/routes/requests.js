const express  = require('express');
const requestRouter  = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');
const user = require('../models/user');

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
            message: req.user.firstName + "is" + status + "in" + toUserId.firstName,
            data
        });
    } catch (error) {
        res.status(400).send("ERROR: "  + error.message);
    }
    
    
});

requestRouter.get('/admin/deleteAllUserData', (req, res, next) => {
    res.send('delete all user data sent');
});

// feed API  - get  all the user from deta database
requestRouter.get('/feed', async (req, res) => {
    try {
        const userdetails = await User.find({});

        if(userdetails.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userdetails);
        }
        
    } catch {
        res.status(400).send("User not found");
    }

});


requestRouter.post("/bulkupdate", async (req, res) => {
    const updates = req.body;
    try {
       const result = await User.bulkWrite(updates);
       console.log('Bulk update result:', result);
       res.status(200).send("Bulk update successful");
    } catch (err) {
        console.error('Bulk update error:', err);
        res.status(400).send("Bulk update did not work as expected");
    }

});

module.exports = requestRouter;