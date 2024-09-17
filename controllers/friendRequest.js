const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');



const sendFriendRequest = async (req) => {
    const { from, to } = req;

    if (!from || !to) {
        return 'There is an error related to IDs'
    }

    const request = new FriendRequest({ from, to, currentStatus: 'Sended' });
    await request.save();

    const user = await User.findById(to.id);

    return request;
};

const deniesFriendRequest = async (req) => {
    const request = await FriendRequest.findByIdAndUpdate(req, { currentStatus: 'Denied' });

    return request;
};

const acceptFriendRequest = async (req) => {
    const { requestID, from, to } = req;

    const request = await FriendRequest.findByIdAndUpdate(requestID, { currentStatus: 'Accepted' });

    const user = await User.findById(to);
    user.friends.push(from);

    const newFriend = await User.findById(from);
    newFriend.friends.push(user._id);

    await user.save();
    await newFriend.save();

    return request;
};


module.exports = {
    sendFriendRequest,
    deniesFriendRequest,
    acceptFriendRequest
}