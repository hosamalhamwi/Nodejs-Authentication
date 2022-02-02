const Speakeasy  = require('speakeasy');

const { connect_db } = require("../../database/db");
const User = require("../../models/user");

function google_verify(req, res) {

    if (req.body.email == undefined || req.body.code == undefined) {
        res.status(400).send({
            "status": false,
            "message": "Email or code is missing"
        });

    } else {

        connect_db(process.env.MONGO_URI);

        User.findOne({
            email: req.body.email
        }).then(async (user) => {


            if (!user) {
                res.status(403).send({
                    "status": false,
                    "message": "Unauthorized"
                })
            } else {
                var verified = Speakeasy.totp.verify({
                    secret: user.google_auth.secret,
                    encoding: 'base32',
                    token: req.body.code,
                    window: 1
                });

                if (verified) {
                    res.send({
                        message: 'Verified'
                    })
                } else {
                    res.send({
                        message: 'Not Verified'
                    })
                }
            }




        }).catch((err) => {
            res.status(400).send({
                "status": false,
                "message": err.message
            });
        }
        );
    }
}

module.exports = { google_verify };