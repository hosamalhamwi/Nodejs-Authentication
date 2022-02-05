require('dotenv').config()
const express = require('express');

const {
    sign_up,
    email_verification,
    forgot_password,
    sign_in,
    forgot_verify,
    new_password,
    google_QRCode,
    google_verify
} = require('./controllers');



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