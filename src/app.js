const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();



// middle ware for converting all request into json format.
app.use(express.json());
// this is essential will only give the response for next request.
app.use(cookieParser()); 

const authRouter  = require('./routes/auth');
const profileRouter  = require('./routes/profile');
const requestRouter  = require('./routes/requests');
const userRouter  = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDb().then(() => {
    console.log('Database has been successfuly connected.');
    app.listen(3000, () => {
        console.log('server is listening on 3000');
    });
}).catch((error) => {
    console.log('connected failed', error);
})
