require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/jwt')
.then(() =>{
    console.log("DB conneced")
}).catch((err) =>{
    console.log("Didnt connected")
})

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const router = require('./router/user');
app.use('/api',router);


let PORT = process.env.PORT || 4100;
app.listen(PORT,() =>{
    console.log(`Listening at the ${PORT}`);
});
