const express = require('express');
const Joi = require('joi');
const User = require('./models/user');
require("./database/db")



const app = express();
const PORT = 1111;

app.use(express.json());

app.post('/register', async (req, res) => {

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

    } else {

        const newUser = new User(req.body);
        await newUser
            .save()
            .then(() => {
                res.status(200).send({
                    "status": true,
                    "message": "Successfully registered",
                });
            })
            .catch((err) => {
                res.status(400).send({
                    "status": false,
                    "message": err.message
                });
                
            });
    }
    res.end();


});

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));