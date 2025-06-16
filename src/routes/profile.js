const express  = require('express');
const profileRouter  = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData }  = require('../utils/validation');
// get user by email
profileRouter.post('/profile/user',  async (req, res) => {
    const userEmailId = req.body.emailId;
    console.log(userEmailId);
    try {
        const userdetails = await User.findOne({ emailId : userEmailId });

        if(userdetails.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userdetails);
        }
        
    } catch {
        res.status(400).send("User not found");
    }

});

// delete user by email
profileRouter.delete('/profile/delete', userAuth, async (req, res) => {
    const userEmailId = req.body.emailId;
    console.log(userEmailId);
    try {
        const userdetails = await User.findOneAndDelete({ emailId : userEmailId });

        if(userdetails.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userdetails);
        }
        
    } catch {
        res.status(400).send("User not found");
    }

});

// modify the data of user by email
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    
    try {
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=> {
            return loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, you are profile is updated successfully`,
            data: loggedInUser
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }

});




// get user by email
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    
    try {
        console.log("in -- profile", req.user);
        res.send(req.user);
    } catch {
        res.status(400).send("User not found");
    }

});


module.exports = profileRouter;