const express = require("express");
const userRouter  = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", "firstName lastName");
        // }).populate("fromUserId", ["firstName", "lastName"]); // this is one way to populate API
        console.log(connectionRequest)
        res.json({ message: "Connected to DB" ,
            data:connectionRequest
        });

    } catch (error) {
        res.status(400).send("ERROR: "  + error.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName about skills")
        .populate("toUserId", "firstName lastName about skills");
        // }).populate("fromUserId", ["firstName", "lastName"]); // this is one way to populate API

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });
        console.log(data)
        res.json({ message: "Connections retrieved" ,
            data:data
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// feed api
userRouter.get('/feed', userAuth, async (req, res) => {

    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip =  (page - 1) * limit;

        // user should see all interested profile and user not send any request self,
        // should not see ignored profile
        // should not see accepted profile
        // should not see his profile
        // should not already send request

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set(); 
        connectionRequest.forEach( (req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users  = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUsersFromFeed)}}, // we have cases which we should not want as a part filter 
                { _id: { $ne: loggedInUser._id}} // not in meaning it should not return self
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        console.log(users)
        res.json({ message: "Connections retrieved" ,
            data:users
        });

        

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
module.exports = userRouter;