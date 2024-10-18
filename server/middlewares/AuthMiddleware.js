const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token)
        if(!token) {
            return res.status(401).send("Unauthorized");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(!decoded) {
            return res.status(401).send("Unauthorized");
        }
        let user = await UserModel.findOne({ email: decoded.email });
        if(!user) {
            return res.status(404).send("User not found");
        }
        req.userId = user._id;
        next()
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}