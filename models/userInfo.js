// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const userInfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userAlias: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    userAge: {
        type: String,
        required: false
    },
    userCity: {
        type: String,
        required: false
    },
});

// EXPORTS
module.exports = mongoose.model('UserInfo', userInfoSchema);