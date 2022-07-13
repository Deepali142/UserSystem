const express = require('express')
const {register,
    signin,
    userList,
    getUser,
    updateUser,
    changePassword} = require('../controller/user');
    
const { authenticate } = require('../middleware/jwt');
const router = express.Router();

router.post('/registerNewUser',register);
router.post('/signIn',signin);
router.get('/getUser',getUser);
router.get("/userList",authenticate,userList);
router.put('/updateUserById',updateUser);
router.put('/changePassword',authenticate,changePassword);
// router.put('/forgotPassword',controller.forgotPassword);
// router.post('/verifyOtp',controller.verify_otp)

module.exports = router;
