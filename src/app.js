const express = require('express');
const connectDb = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData, validateEmailId }  = require('./utils/validation');

const cookieParser = require('cookie-parser');

const { userAuth } = require('./middlewares/auth');
const user = require('./models/user');

// middle ware for converting all request into json format.
app.use(express.json());
// this is essential will only give the response for next request.
app.use(cookieParser()); 


app.get('/admin/getAllUserData', (req, res, next) => {
    res.send('get all user data sent');
});

app.get('/admin/deleteAllUserData', (req, res, next) => {
    res.send('delete all user data sent');
});

// feed API  - get  all the user from deta database
app.get('/feed', async (req, res) => {
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

// get user by email
app.get('/user', async (req, res) => {
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
app.delete('/user', async (req, res) => {
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
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data  = req.body;
    
    try {
        const ALLOWEDUPDATES = [
            "age",
            "gender",
            "photoUrl",
            "skills",
            "about",
            "password",
            "emailId"
        ];
        const isUpdateAllowed  = Object.keys(data).every((k) => ALLOWEDUPDATES.includes(k) );
        console.log('isUpdateAllowed', isUpdateAllowed);
        if(!isUpdateAllowed) {
            throw new Error("update not allowed as it has the dublicate data");
        }
        console.log('skills ', data?.skills?.length);
        if(data?.skills?.length > 10){
            throw new Error("you can not add more data");
        }
        const userdetails = await User.findByIdAndUpdate({_id: userId}, data,{
            runValidators:true
        });

        if(userdetails.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userdetails);
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }

});

// sign up api
app.post("/signup", async (req, res) => {
    
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
app.post("/login", async (req, res) => {
    
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


// get user by email
app.get('/profile', userAuth, async (req, res) => {
    
    try {
        console.log("in -- profile");
        res.send(req.user);
    } catch {
        res.status(400).send("User not found");
    }

});

app.post("/bulkupdate", async (req, res) => {
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

app.use('/', (error, req, res, next) => {
    if(error){
        res.status(500).send("something went wrong");
    }
});

connectDb().then(() => {
    console.log('Database has been successfuly connected.');
    app.listen(3000, () => {
        console.log('server is listening on 3000');
    });
}).catch((error) => {
    console.log('connected failed');
})
