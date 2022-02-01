const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    code: Number,
    status : Boolean,
    created_at: Date,
});



const User = mongoose.model('NodeJS', UserSchema , 'Users');

module.exports = User;