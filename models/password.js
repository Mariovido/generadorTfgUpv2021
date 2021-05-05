// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const passwordSchema = new Schema({
    passwordName: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    hints: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Hint',
            required: true
        }
    ]
});

// EXPORTS
module.exports = mongoose.model('Password', passwordSchema);