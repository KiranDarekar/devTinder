const express = require('express');
const connectDb = require('./config/database');
const app = express();
const User = require('./models/user');

// middle ware for converting all request into json format
app.use(express.json());

const { adminAuth, userAuth } = require('./middlewares/auth');
app.use('/admin', adminAuth);

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
app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data  = req.body;
    
    try {
        const userdetails = await User.findByIdAndUpdate(userId, data,{
            runValidators:true
        });

        if(userdetails.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(userdetails);
        }
        
    } catch {
        res.status(400).send("User not found");
    }

});

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("user added succesfully !!!");
    } catch (error) {
        res.status(400).send(error.errors.phone.message);
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
