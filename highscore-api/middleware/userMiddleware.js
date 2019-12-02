var jwt = require("jsonwebtoken");
const accountSchema = require("../models/accountSchema");

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'].split(" ")[1];
    // console.log(authHeader);
    try {
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
            // console.log(err, decoded)
            if (err == null) {
                console.log(decoded);
                accountSchema.User.findOne({
                    _id: decoded._id
                }, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {
                        req.user = user;
                        next();
                    }
                });
            } else {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(401);
        res.json({
            message: "User could not be verified"
        })
    }
}