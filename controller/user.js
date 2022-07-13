
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// async function hashPassword(password) {
//     return await bcrypt.hash(password, 10);
// }
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
// function betweenRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!first_name && !last_name && !email && !password) {
            console.log('All fields are required!!')
            return res.send("All fields are required!!")
        }
        // verify if the user exists already

        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.send("User already exists . Please login")
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,

        });
        res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
    }

};

exports.signin = (req, res) => {
    if (!req.body.email && !req.body.password) {
        return res.send({ success: false, error: "send needed parameters" });
    }
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.json("User doesnt exists");
            } else {
                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    res.json({ success: false, error: "Password didnt match" })
                } else {
                    const accessToken = jwt.sign({ "_id": user._id }, 'dipali',
                        {
                            expiresIn: "1d"
                        });
                    res.json({ success: true, accessToken: accessToken })
                }
            }
        }).catch((err) => {
            return res.json({ success: false, message: err.message })
        })
};

exports.userList = (req, res) => {
    User.find().then(data => {
        return res.json(data)
    }).catch(err => {
        return res.json(err)
    })
};

exports.getUser = (req, res) => {
    var id = req.body.id;
    if (id == null || id == undefined || id == '') {
        return res.send('Please Enter UserID')
    }
    User.findById({ _id: id })
        .then((User) => {
            return res.send(User);
        }).catch((err) => {
            return res.send(err);
        })
};

exports.updateUser = async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const id = req.body.id
    var data = await User.findByIdAndUpdate({ _id: id }, { $set: { first_name: first_name, last_name: last_name } }, { new: true })
    if (!data) {
        return res.status(400).send('User not updated')
    } else {
        return res.status(200).send('User updated successfully',User)
    }

};

exports.changePassword = async (req, res) => {
    const data = req.body;
    var user = await User.findById({ _id: data._id })

    const validOldPassword = await validatePassword(req.body.oldPassword, user.password);
    if (!validOldPassword)
        return res.json({ message: 'incorrect old password' })

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    const result = await User.updateOne({ _id: data._id }, { $set: { password: hashedPassword } }, { new: true });
    if (!result) {
        return res.send('Bad request')
    } else {
        return res.send('Password set successfully!!')
    }
};

// exports.forgotPassword = async (req, res) => {
//     var email = req.body.email;
//     var otp = betweenRandomNumber(1000, 999)
//     var data = await user.findOne({ email: req.body.email })
//     console.log(data)
//     if (!data) {
//         return res.send('Invalid email id!!')
//     }
//     var add_otp = await user.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otp } })
//     console.log('add_otp', add_otp)

//       const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         service:'gmail',
//         port: 587,
//         secure: false,
//         auth: {
//             user: "deepali@gmail.com",
//             pass: "123456",
//         },
//         tls:{
//             rejectUnauthorized: false
//         }
//     });

//     var mailOption = {
//         from: "abc@gmail.com",
//         to: email,
//         subject: "Your otp",
//         text: "OTP - " + otp
//     }
//     console.log("email sent successfully");

//     transporter.sendMail(mailOption, (err, response) => {
//         if (err) {
//             console.log('email not sent',err);
//             res.send(err);
//         } else {
//             console.log("Server is ready to take our message");
//             return res.json({
//                 status: 200,
//                 message: "mail send",
//                 otp: otp,
//                 UserId: add_otp._id
//             })
//         }
//     });
// };

// exports.verify_otp = async (req, res) => {
//     var otp = req.body.otp
//     var _id = req.body._id

//     var user = await User.findOne({ _id: _id })
//     console.log("user", _id)

//     if (!user) {
//         return res.send('Email not found');
//     } else
//         if (!user.data.otp != otp) {
//             return res.send('Wrong otp')
//         } else {
//             return res.send('Verification successful!!')
//         }
// }

// exports.userslist = async (req, res) => {

//     const keyword = req.query.search ? { first_name: { $regex: req.query.search, $options: "i" }, role: { $ne: 3 } } : {};

//     const users = await User.find(keyword).find({ _id: { $ne: req.user._id }, role:{$ne:3}});
//     if(users.length == 0){
//         return res.json({statusCode:400,statusMsj:"User not available"})
//     }else{
//         return res.json({ statusCode: 200, statusMsj: "User List",users:users })
//     }
// }

