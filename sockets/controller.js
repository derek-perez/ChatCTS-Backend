const { Socket } = require('socket.io');

const User = require('../models/User');

const { comprobeJWT } = require('../helpers/generateJWT');
const { messagesPost } = require('../controllers/messages');


const socketController = async (socket = new Socket()) => {

    const user = await comprobeJWT(socket.handshake.headers['x-token']);

    if (!user) {
        console.log('Token: ', socket.handshake.headers['x-token']);
        return socket.disconnect();
    }


    // When user connects, it "joins" a private room.
    // This is to send messages privately
    socket.join(user._id.toString());

    // Set 'Offline' or 'Online' the user statusConnected on DB
    const updateStatus = async () => {
        user.status = 'Online';
        await user.save();
    }
    updateStatus();

    // Send this to the user that reloads the page while chatting. When you reloads the page, it lose all the data and sets the
    // user you were chatting in "Offline", so you need to get again the status of the user...
    socket.broadcast.emit('new-user-connected', user);

    // TODO:
    // Check why whem user enters, why doens't change the label in the Navbar

    // This is to get the status of the user selected to chat
    socket.on('update-user-status', async (payload, callback) => {
        const { friend } = payload;

        const userFriend = await User.findById(friend);

        callback(userFriend);
    });

    // When user disconnects
    socket.on('disconnect', async () => {
        user.status = 'Offline';
        await user.save();

        // Send the update of the user selected on chat
        socket.broadcast.emit('user-chat-disconnected', user);
    })


    // CHAT
    socket.on('new-message', (payload, callback) => {
        messagesPost(payload)
            .then(message => {
                callback(message);

                socket.to(payload.toUser).emit('message-added', message);
            })
            .catch(console.log);
    })

}


module.exports = {
    socketController
}