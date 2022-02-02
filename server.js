require('dotenv').config()
const express = require('express');

const { sign_up } = require('./controllers/sign_up/sign_up');
const { email_verification } = require('./controllers/email_verification/email_verification');
const { sign_in } = require('./controllers/sign_in/sign_in');
const { forgot_password } = require('./controllers/forgot_password/forgot_password');
const { forgot_verify } = require('./controllers/forgot_password/forgot_verify');
const { new_password } = require('./controllers/forgot_password/new_password');
const { google_QRCode } = require('./controllers/google_authenticator/google_QRCode');
const { google_verify } = require('./controllers/google_authenticator/google_verify');

const app = express();


app.use(express.json());
app.post('/register', sign_up);
app.post('/email_verification', email_verification);
app.post('/login', sign_in);
app.post('/forgot_password', forgot_password);
app.post('/forgot_verify', forgot_verify)
app.post('/new_password', new_password)
app.post('/google_auth', google_QRCode);
app.post('/google_verify', google_verify)




app.listen(process.env.API_PORT, () => console.log(`Express server currently running on port ${process.env.API_PORT}`));