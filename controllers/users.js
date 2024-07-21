const bcryptjs = require('bcryptjs');
const User = require('../models/User');


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

const userFriendsPut = async (req, res) => {
    const { friendID } = req.body;

    const user = await User.findById(req.params.id);
    user.friends.push(friendID);

    const newFriend = await User.findById(friendID);
    newFriend.friends.push(user._id);

    await user.save();
    await newFriend.save();

    res.json(user);
}

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

const userDelete = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.json({ user });
}


module.exports = {
    userGet,
    getUserByUsername,
    usersFriendsGet,
    usersPost,
    userFriendsPut,
    userPut,
    userDelete
}