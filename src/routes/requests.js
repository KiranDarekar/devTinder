const express  = require('express');
const requestRouter  = express.Router();
const User = require('../models/user');

requestRouter.post('/sendConnectionRequest', (req, res, next) => {
    const user = req.user;

    console.log("sending connections request...");
    res.send(user.firstName + 'get all user data sent');
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