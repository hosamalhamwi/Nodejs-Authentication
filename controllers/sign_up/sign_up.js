require('dotenv').config()
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const Speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const parser = require('ua-parser-js');

const { connect_db } = require('../../database/db');
const User = require('../../models/user');
const OTP = require('../../models/OTP');
const { email_confirm } = require('../../services/email_confirm');




async function sign_up(req, res) {



    const ua = parser(req.headers['user-agent']);


    // validate the body of the request
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        surname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
    })

    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send({
            "status": false,
            "message": result.error.details[0].message
        });

    } else { // if the request is valid
        connect_db(process.env.MONGO_URI);

        // OTP code
        const code = Math.floor(100000 + Math.random() * 900000);

        // JWT token
        const token = jwt.sign({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Google Authenticator

        var secret = Speakeasy.generateSecret({
            name: 'NodeJS-Authentication',

        });

        // QRCode.toFileStream(res, secret.otpauth_url);

        // User Schema

        const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            code: code,
            status: 0, //0 for unverified, 1 for verified
            created_at: new Date(),
            //  Google Authenticator
            google_auth: {
                secret: secret.base32,
                otpauth_url: secret.otpauth_url, //QRCode URi
            },
            browser: {
                name: ua.browser.name,
                version: ua.browser.version,
            },
            os: {
                name: ua.os.name,
                version: ua.os.version,
            },
            device: {
                architecture: ua.device.architecture,
            }

        });
        const newOTP = new OTP({
            email: req.body.email,
            code: code,
            token: token,
            created_at: new Date(),
        });

        await User.findOne({
            email: req.body.email
        }).then(async (result) => {
            if (result) {
                res.status(400).send({
                    "status": false,
                    "message": "User already exists"
                });
            } else {

                await newUser.save().then(async (result) => {
                    await newOTP.save().then(async (result) => {
                        await email_confirm(process.env.EMAIL, process.env.PASSWORD, req.body.email, req.body.name, code);
                        res.status(200).send({
                            "status": true,
                            "google_auth": {
                                secret: secret.base32,
                                otpauth_url: secret.otpauth_url, //QRCode URi
                            },
                            "token": token,
                            "expires_in": 3600
                        });
                    })
                })
            }
        })
    }
}

module.exports = { sign_up };