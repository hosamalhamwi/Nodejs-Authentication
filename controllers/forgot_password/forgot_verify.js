require('dotenv').config()
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const { connect_db } = require("../../database/db");
const Reset_OTP = require("../../models/reset_OTP");
const Reset_token = require('../../models/reset_token');


async function forgot_verify(req, res) {
    req.headers = {

        'Authorization': req.headers.authorization
    }

    // validate the body of the request
    const schema = Joi.object({
        code: Joi.number().min(2).required()
    })

    const result = schema.validate(req.body);


    if (req.headers.Authorization == undefined) {
        res.status(403).send({
            "status": false,
            "message": "Authorization header is missing"
        });

    } else if (result.error) {
        res.status(400).send({
            "status": false,
            "message": result.error.details[0].message
        })

    } else { // if the request is valid

        connect_db(process.env.MONGO_URI);

        Reset_OTP.findOne({
            token: (req.headers.Authorization).replace('Bearer ', '')
        })
            .then(async (result) => {

                if (result.code == req.body.code) {

                    const token = jwt.sign({
                        email: result.email,
                        prev_token: req.headers.Authorization,

                    }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

                    res.status(200).send({
                        "status": true,
                        "message": "Status verified",
                        "token": token
                    })

                    await Reset_OTP.deleteOne({
                        token: (req.headers.Authorization).replace('Bearer ', '')
                    })

                    const new_token = new Reset_token({
                        email: result.email,
                        token: token
                    })

                    new_token.save()



                } else if (result.code != req.body.code) {

                    res.status(400).send({
                        "status": false,
                        "message": "Code is not correct"
                    })
                }

                res.end();

            }
            ).catch(err => {
                console.log(err);
                res.status(401).send({
                    "status": false,
                    "message": "Unathorized"
                });
            }
            );

    }

}

module.exports = { forgot_verify };