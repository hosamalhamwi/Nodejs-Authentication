require('dotenv').config()
const jwt = require("jsonwebtoken");
const { connect_db } = require('../../database/db');
const Reset_OTP = require('../../models/reset_OTP');
const User = require('../../models/user');
const { email_confirm } = require('../../services/email_confirm');


async function forgot_password(req, res) {

    if (req.body.email == undefined) {
        res.status(400).send({
            "status": false,
            "message": "Email is missing"
        });
    } else {
        connect_db(process.env.MONGO_URI);
        const code = Math.floor(100000 + Math.random() * 900000);
        const token = jwt.sign({
            email: req.body.email,
            
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });



        User.findOne({
            email: req.body.email
        })
            .then(async (user) => {
                if (!user) {
                    res.status(403).send({
                        "status": false,
                        "message": "Unauthorized"
                    })
                } else {


                    email_confirm(process.env.EMAIL, process.env.PASSWORD, req.body.email, req.body.email, code);

                    const newOTP = new Reset_OTP({
                        email: user.email,
                        code: code,
                        token: token,
                        created_at: new Date(),
                    });


                    newOTP.save()

                    res.status(200).send({
                        "status": true,
                        "message": "Verification code has been send to your email",
                        "token": token
                    })
                }
                res.end();
            }
            )
            .catch((err) => {
                res.status(400).send({
                    "status": false,
                    "message": err.message
                });
            }
            );
    }
}

module.exports = { forgot_password };