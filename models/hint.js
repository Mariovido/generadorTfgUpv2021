// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const hintSchema = new Schema({
    passwordId: {
        type: Schema.Types.ObjectId,
        ref: 'Password',
        required: true
    },
    hintName: {
        type: String,
        required: true
    },
    hintValue: {
        type: String,
        required: false
    }
});

// EXPORTS
module.exports = mongoose.model('Hint', hintSchema);