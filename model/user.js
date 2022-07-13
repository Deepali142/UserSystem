const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
   
    first_name: {
        type: 'string',
        default: null,
    },
    last_name: {
        type: 'string',
        default: null,
    },
    email: {
        type: 'string',
        unique: true,
    },
    password: {
        type: 'string',
    },
    // verify: {
    //     type:Number,
    // },
    // otp: {
    //     type:Number,
    // },
    // confirmPassword:{
    //     type: 'string'
    // },
    accesstoken: {
        type: 'string'
    },
    isDelete: {
        type: Boolean,
        default:'false'
    },
},{timestamps:true});

const user = mongoose.model('User', Schema);
module.exports = user;