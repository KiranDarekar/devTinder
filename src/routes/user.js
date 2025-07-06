const express = require("express");
const userRouter  = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');


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
module.exports = userRouter;