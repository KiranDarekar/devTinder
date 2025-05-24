console.log('starting a new project');
const express = require('express');

const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth');
app.use('/admin', adminAuth);


app.get('/admin/getAllUserData', (req, res, next) => {
    res.send('get all user data sent');
});

app.get('/admin/deleteAllUserData', (req, res, next) => {
    res.send('delete all user data sent');
});



app.get('/user', userAuth, (req, res, next) => {
    res.send('user data send');
});

app.listen(3000, ()=>{
    console.log('server is listening on 3000');
});