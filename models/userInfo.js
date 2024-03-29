// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const userInfoSchema = new Schema({
    userAlias: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    userAge: {
        type: Number,
        required: false
    },
    userCity: {
        type: String,
        required: false
    },
});

// EXPORTS
module.exports = mongoose.model('UserInfo', userInfoSchema);