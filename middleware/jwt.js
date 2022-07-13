const user = require("../model/user")
const jwt = require('jsonwebtoken')

exports.authenticate = async(req, res, next) => {
    let accessToken;
    if (req.headers && req.headers.authorization) {
        console.log('true')
        try {
            accessToken = req.headers.authorization
        
            const decoded = jwt.verify(accessToken,'dipali')
            
            console.log('decoded',decoded)
            req.user = await user.findById(decoded.userId)
            next();
        } catch (err) {
            console.log("error", err)
            return res.json({
                status: 401,
                message: "Not authorized , token is not valid"
            });
        }
    }else{
        console.log('false')
        return res.send('No token found')

    }
}


