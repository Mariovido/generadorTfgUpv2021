// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiration: {
        type: Date,
        required: false
    },
    userInfo: {
        type: Schema.Types.ObjectId,
        ref: 'UserInfo',
        required: true
    }
});

// EXPORTS
module.exports = mongoose.model('User', userSchema);