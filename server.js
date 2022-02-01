const express = require('express');
require('dotenv').config()
const { sign_up } = require('./controllers/sign_up/sign_up');
const { email_verification } = require('./controllers/email_verification/email_verification');
const { sign_in } = require('./controllers/sign_in/sign_in');
const OTP = require('./models/OTP');
const { connect_db } = require('./database/db');
const Joi = require('joi');

const app = express();


app.use(express.json());
app.post('/register', sign_up);
app.post('/email_verification', email_verification);
app.post('/login', sign_in);


app.listen(process.env.API_PORT, () => console.log(`Express server currently running on port ${process.env.API_PORT}`));