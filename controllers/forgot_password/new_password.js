const Joi = require("joi");
const bcrypt = require('bcryptjs');

const { connect_db } = require("../../database/db");
const Reset_token = require("../../models/reset_token");
const User = require("../../models/user");

async function new_password(req, res) {
    req.headers = {

        'Authorization': req.headers.authorization
    }

    const schema = Joi.object({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
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

    } else {
        connect_db(process.env.MONGO_URI);

        Reset_token.findOne({
            token: (req.headers.Authorization).replace('Bearer ', '')
        })
            .then(async (result) => {

                if (result.token == (req.headers.Authorization).replace('Bearer ', '')) {

                    await User.updateOne({
                        email: result.email
                    }, {
                        password: bcrypt.hashSync(req.body.password, 10)
                    })

                        .then(() => {
                            res.status(200).send({
                                "status": true,
                                "message": "Password updated"
                            })
                        })

                    await Reset_token.deleteOne({
                        token: (req.headers.Authorization).replace('Bearer ', '')
                    }).then(() => {
                        
                        res.end();
                    })

                } else {

                    res.status(403).send({
                        "status": false,
                        "message": "Unathorized"
                    })
                }



            }
            ).catch(err => {
                console.log(err);
                res.status(500).send({
                    "status": false,
                    "message": "Internal Server Error"
                });
            }
            );

    }
}

module.exports = { new_password };