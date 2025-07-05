const express = require("express");
const userRouter  = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');


userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try{

        const loggedInUser = req.user;
console.log(loggedInUser._id)
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status:"interested"
        })
        console.log(connectionRequest)
        res.json({ message: "Connected to DB" ,
            data:connectionRequest
        });

    } catch (error) {
        res.status(400).send("ERROR: "  + error.message);
    }
});

module.exports = userRouter;