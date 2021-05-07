// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const hintSchema = new Schema({
    hintName: {
        type: String,
        required: true
    },
    hintValue: {
        type: String,
        required: false
    },
    hintHash: {
        type: String,
        required: true
    },
    isIntroducedByUser: {
        type: Boolean,
        required: true
    }
});

// EXPORTS
module.exports = mongoose.model('Hint', hintSchema);