require('dotenv').config()
const express = require('express');

const { sign_up } = require('./controllers/sign_up/sign_up');
const { email_verification } = require('./controllers/email_verification/email_verification');
const { sign_in } = require('./controllers/sign_in/sign_in');
const { forgot_password } = require('./controllers/forgot_password/forgot_password');
const { forgot_verify } = require('./controllers/forgot_password/forgot_verify');
const { new_password } = require('./controllers/forgot_password/new_password');

const app = express();


app.use(express.json());
app.post('/register', sign_up);
app.post('/email_verification', email_verification);
app.post('/login', sign_in);
app.post('/forgot_password', forgot_password);
app.post('/forgot_verify', forgot_verify)
app.post('/new_password', new_password)




app.listen(process.env.API_PORT, () => console.log(`Express server currently running on port ${process.env.API_PORT}`));