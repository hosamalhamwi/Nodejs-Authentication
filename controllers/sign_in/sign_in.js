require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { connect_db } = require("../../database/db");
const User = require("../../models/user");

async function sign_in(req, res) {
    const auth = {
        email: req.body.email,
        password: req.body.password
    }

    if (auth.email == undefined || auth.password == undefined) {
        res.status(400).send({
            "status": false,
            "message": "Email or password is missing"
        });
    } else {

        connect_db(process.env.MONGO_URI);
        User.findOne({
            email: auth.email
        })
            .then(async (user) => {
                if (!user) {
                    res.status(403).send({
                        "status": false,
                        "message": "Unauthorized"
                    })
                } else {
                    if (bcrypt.compareSync(auth.password, user.password)) {
                        const token = jwt.sign({
                            email: user.email,
                            name: user.name,
                            surname: user.surname,
                        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

                        res.status(200).send({
                            "status": true,
                            "message": "User logged in",
                            "token": token
                        })
                    } else {
                        res.status(403).send({
                            "status": false,
                            "message": "Unauthorized"
                        })
                    }
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

module.exports = { sign_in };