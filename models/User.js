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
    stayLoggedIn: {
        type: Boolean,
        default: false
    },
    ntfSubscription: {
        endpoint: {
            type: String,
            required: false
        },
        expirationTime: {
            type: Date,
            default: null
        },
        keys: {
            p256dh: {
                type: String,
                required: false
            },
            auth: {
                type: String,
                required: false
            }
        }
    },
    info: {
        type: String
    },
    status: {
        type: String,
        default: 'Online'
    },
    phone: {
        type: String
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    socialMedia: {
        type: Schema.Types.Object,
        default: {}
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
    postsLiked: {
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