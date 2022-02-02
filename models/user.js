const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    code: Number,
    status: Boolean,
    created_at: Date,
    //  Google Authenticator
    google_auth : {
        secret: String,
        otpauth_url: String,
    },
    // store object with user's browser info
    browser: {
        name: String,
        version: String,
    },
    // store object with user's os info
    os: {
        name: String,
        version: String,
    },
    // store object with user's device info
    device: {
        architecture: String,
    }

});



const User = mongoose.model('NodeJS', UserSchema, 'Users');

module.exports = User;