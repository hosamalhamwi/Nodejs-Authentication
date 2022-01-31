const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    repeat_password: String
});

const User = mongoose.model('NodeJS', UserSchema , 'Users');

module.exports = User;