const jwt = require('jsonwebtoken');
const User = require('../models/user')


const userAuth = async (req, res, next) => {
   try { 
        // read the token from req cookies
        const {token} = req.cookies;
        // check is token has the value
        if(!token) {
            return res.status(401).send("Please login")
        }

        const decodedIdFromToken = jwt.verify(token, 'Dev@Tinder007');
        const {_id} = decodedIdFromToken;

        // fetch the profile from base on id
        const userdetails = await User.findById(_id);
        
        if(!userdetails) {
            throw new Error("User does not exist !!!")
        }

        req.user = userdetails;

        next();
        
    } catch (error) {
        res.status(400).send("ERROR - " + error.message);
    }
}

module.exports = {
    userAuth
}