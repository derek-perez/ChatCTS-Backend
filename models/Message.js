const { Schema, model } = require('mongoose');


const MessageSchema = Schema({
    text: {
        type: String,
        required: [true, 'The text is required']
    },
    date: {
        type: String,
        required: [true, 'The date is required']
    },
    fromUser: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    toUser: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
});


module.exports = model('Message', MessageSchema);