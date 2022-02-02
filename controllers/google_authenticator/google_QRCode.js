const QRCode = require('qrcode');

const { connect_db } = require("../../database/db");
const User = require("../../models/user");

async function google_QRCode(req, res) {

    if (req.body.email == undefined) {
        res.status(400).send({
            "status": false,
            "message": "Email is missing"
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
                QRCode.toFileStream(res, user.google_auth.otpauth_url)
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

module.exports = { google_QRCode };







