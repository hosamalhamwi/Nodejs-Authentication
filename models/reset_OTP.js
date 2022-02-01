const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OTPSchema = new Schema({
    email: String,
    code: Number,
    token: String,
    created_at: Date,
});

const Reset_OTP = mongoose.model('Reset_OTP', OTPSchema, 'Reset_OTP');

module.exports = Reset_OTP;