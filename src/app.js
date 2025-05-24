console.log('starting a new project');
const express = require('express');

const app = express();

// app.get('/:file{.:ext}', (req, res) => {
//     const params = Object.assign({}, req.params);
//     console.log(params);
//     res.status(200).send({ name: 'Ruben' })
// })

app.get('/user', 
    [(req, res, next) => {
        console.log('inside handler');
        // res.send('route handler');
        next();
    },
    (req, res, next) => {
        console.log('inside handler 2');
        // res.send('route handler 2');
        next();
    },
    (req, res, next) => {
        console.log('inside handler 3');
        // res.send('route handler 3');
        next();
    },
    (req, res, next) => {
        console.log('inside handler 4');
        res.send('route handler 4');
    },
    (req, res, next) => {
        console.log('inside handler 5');
        res.send('route handler 5');
    }]
);

app.listen(3000, ()=>{
    console.log('server is listening on 3000');
}, (error) => {
  if (error) {
    throw error // e.g. EADDRINUSE
  }
  console.log(`Listening on ${JSON.stringify(error)}`)
});