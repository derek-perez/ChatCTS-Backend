const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');


const userGet = async (req, res) => {
    const user = await User.findById(req.params.id);

    res.json(user);
}

const getUserByUsername = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });

    res.json(user);
}

const usersFriendsGet = async (req, res) => {
    const { friends } = await User.findById(req.params.id);

    res.json(friends);
}

// Friend requests \\
const getFriendRequests = async (req, res) => {
    const id = req.params.id;

    if (id === undefined || id === 'undefined') return;

    const [total, allRequests] = await Promise.all([
        FriendRequest.countDocuments(),
        FriendRequest.find()
    ]);

    res.json(allRequests);
}
// Friend requests //

const usersPost = async (req, res) => {
    const { name, email, password, profilePicture, info, username, socialMedia } = req.body;
    const user = new User({ name, email, password, profilePicture, info, username, socialMedia });

    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Store on DB
    await user.save();

    res.json(user)
};

const userPut = async (req, res) => {
    const id = req.params.id;
    const { _id, password, google, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
}

const userNtfSubscription = async (req, res) => {
    const email = req.params.email;
    const { subscription } = req.body;

    const user = await User.findOne({ email });
    user.ntfSubscription = subscription;

    await user.save();

    res.json({ msg: 'Subscription storaged' });
}

const userDelete = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.json({ user });
}


module.exports = {
    userGet,
    getUserByUsername,
    usersFriendsGet,
    getFriendRequests,
    usersPost,
    userPut,
    userNtfSubscription,
    userDelete
}