console.log('starting a new project');
const express = require('express');

const app = express();

app.use("/", (req, res)=>{
    res.send('normal started responding');
});

app.use("/hello", (req, res)=>{
    res.send('hello server started responding');
});

app.use("/test", (req, res)=>{
    res.send('server started responding');
});

app.listen(3000, ()=>{
    console.log('server is listening on 3000');
});