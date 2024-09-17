const { Schema, model } = require('mongoose');


const FriendRequestSchema = Schema({
    from: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        profilePicture: { type: String, required: true }
    },
    to: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        profilePicture: { type: String, required: true }
    },
    currentStatus: {
        type: String,
        required: true
    }
});


module.exports = model('FriendRequest', FriendRequestSchema);