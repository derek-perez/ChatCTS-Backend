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
        default: [],
        required: [true, 'The ID from user is required']
    },
    comments: {
        type: [Schema.Types.Object],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    reTweets: {
        type: Number,
        default: 0
    }
});


module.exports = model('Post', PostSchema);