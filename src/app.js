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

app.get('/user', (req, res, next) => {
    // try {
        throw new Error('there is error in code');
    // } catch (error) {
    //     res.status(500).send("some error contact support team");
    // }
    
});

app.post("/signup", async (req, res) => {
    
     const user = new User(req.body);

    try {
        await user.save();
        res.send("user added succesfully !!!");
    } catch(error){
        res.status(400).send("user added succesfully !!!");
    }
    
});

app.use('/', (error, req, res, next) => {
    if(error){
        res.status(500).send("something went wrong");
    }
});

connectDb().then(() =>{
    console.log('Database has been successfuly connected.');
    app.listen(3000, ()=>{
        console.log('server is listening on 3000');
    });
}).catch((error) => {
    console.log('connected failed');
})
