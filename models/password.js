// NPM PACKAGES DECLARATIONS
const mongoose = require('mongoose');

// SCHEMA DECLARATION
const Schema = mongoose.Schema;

// SCHEMA
const passwordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passwordName: {
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