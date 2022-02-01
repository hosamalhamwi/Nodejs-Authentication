require('dotenv').config()

const Joi = require('joi');
const { connect_db } = require('../../database/db');
const OTP = require('../../models/OTP');
const User = require('../../models/user');


async function email_verification(req, res) {
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

        OTP.findOne({
            token: (req.headers.Authorization).replace('Bearer ', '')
        })
            .then(async (result) => {

                if (result.code == req.body.code) {
                    await OTP.deleteOne({
                        token: (req.headers.Authorization).replace('Bearer ', '')
                    })

                    //update the user status to 1 (verified)
                    await User.updateOne({
                        email: result.email
                    }, {
                        status: 1
                    })
                        .then(() => {
                            res.status(200).send({
                                "status": true,
                                "message": "Email verified"
                            })
                        })


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


module.exports = { email_verification };