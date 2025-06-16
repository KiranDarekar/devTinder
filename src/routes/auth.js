const express  = require('express');
const authRouter  = express.Router();
const { validateSignUpData, validateEmailId }  = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// sign up api
authRouter.post("/signup", async (req, res) => {
    
    console.log('sign up in......')
    try {

        // validate Sign up data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
         
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("user added succesfully !!!");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }

});

// login api
authRouter.post("/login", async (req, res) => {
    
    console.log('login in......')
    try {
        const { emailId, password } = req.body;
        // validate login data
        validateEmailId(req);

        // check email is there OR not in DB
        const userDetails = await User.findOne({ emailId: emailId});

        if(!userDetails){
            throw new Error("Invalid Credentials !!!");
        }
        console.log("password ", password);
        // Load hash from your password DB.
        const passwordHash = await userDetails.validatePassword(password);
        console.log("passwordHash ", passwordHash);
        if(passwordHash) {

            // create JWT token
            const token = await userDetails.getJWT();

            // add token to cookie and send the response back to the user
            res.cookie('token', token,
                { 
                    expires: new Date(Date.now() + 900000)

                }
            );
            res.send("login is succesfully !!!");
        } else {
            throw new Error("Invalid Credentials !!!");
        }

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// logout api
authRouter.post("/logout", async (req, res) => {
    
    console.log('login in......')
    try {
        // add token to cookie and send the response back to the user
        res.cookie('token', null,
            { 
                expires: new Date(Date.now())

            }
        ).send("logout is succesfully !!!");

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }

});


module.exports = authRouter;