const { Schema, model } = require('mongoose');


const PostSchema = Schema({
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
    }
});


module.exports = model('Post', PostSchema);