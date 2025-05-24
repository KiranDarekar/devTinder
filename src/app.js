console.log('starting a new project');
const express = require('express');

const app = express();

// app.use("/", (req, res)=>{
//     res.send('hello 2 started responding');
// });

// this will only handle get call /user
app.get("/user", (req, res)=>{
    res.send({
        firstName: "Kiran"
    });
});

// this call will save data to post call /user
app.post("/user", (req, res)=>{
    console.log('saving the data to DB');
    res.send("Data has been succefully save in DB");
});

// this call will save data to post call /user
app.delete("/user", (req, res)=>{
    console.log('deleted the data from DB');
    res.send("Data has been succefully deleted in DB");
});


app.listen(3000, ()=>{
    console.log('server is listening on 3000');
});