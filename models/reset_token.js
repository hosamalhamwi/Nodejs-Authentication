const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OTPSchema = new Schema({
    email: String,
    token : String,
});

const Reset_token = mongoose.model('Reset_token', OTPSchema, 'Reset_token');

module.exports = Reset_token;