const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'The email is required']
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    profilePicture: {
        type: String
    },
    phone: {
        type: String
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: 'Message',
        default: []
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Post',
        default: []
    },
    google: {
        type: Boolean,
        required: false
    }
})


module.exports = model('User', UserSchema);