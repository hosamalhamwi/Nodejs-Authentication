const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OTPSchema = new Schema({
    email: String,
    code: Number,
    token: String,
    created_at: Date,
});

const OTP = mongoose.model('OTP', OTPSchema, 'OTP');

module.exports = OTP;