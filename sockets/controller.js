const { Socket } = require('socket.io');
const { v4: uuid } = require('uuid');

const User = require('../models/User');

const { comprobeJWT } = require('../helpers/generateJWT');
const { messagesPost } = require('../controllers/messages');
const { addComment, postLiked, postDisliked, postsPost } = require('../controllers/posts');

const {
    sendFriendRequest,
    deniesFriendRequest,
    acceptFriendRequest
} = require('../controllers/friendRequest');


const socketController = async (socket = new Socket()) => {

    const user = await comprobeJWT(socket.handshake.headers['x-token']);

    if (!user) {
        console.log('Token: ', socket.handshake.headers['x-token']);
        socket.emit('no-token', 'Needs to reload');

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

    // ---------- Chat ---------- \\
    // Receives the message and send it to 'messagesPost' to save it on DB.
    // Then send back the message to the user to be displayed on UI
    socket.on('new-message', (payload, callback) => {
        messagesPost(payload)
            .then(message => {
                callback(message);

                socket.to(payload.toUser).emit('message-added', message);
            })
            .catch(console.log);
    });


    // ---------- Posts ---------- \\
    // ° ----- Post ----- °
    // Receives the new post, add it to DB through 'postsPost' and sends it to everybody
    socket.on('add-post', (payload, callback) => {
        // Payload: text, date, fromUser
        postsPost(payload)
            .then((payload) => {
                socket.broadcast.emit('new-post', payload);

                callback('Done');
            })
            .catch(console.log);
    })

    // ° ----- Comments ----- °
    // Receives the comment and send it to 'addComment' it to save it on DB (Model: Post).
    // Then, send back to the comment to the user to be displayed on UI
    socket.on('new-comment', (payload) => {
        addComment(payload)
            .then(comment => {
                socket.broadcast.emit('comment-added', comment);
            })
            .catch(console.log);
    });

    // ° ----- Likes ----- °
    // When user clicks the "Like" button, it the event below. So I save it on DB trough 'postLiked' and them I broadcast the like
    socket.on('add-like-post', (payload, callback) => {
        postLiked(payload)
            .then(() => {
                callback('Done')
                socket.broadcast.emit('post-liked', 'Post liked');
            })
            .catch(console.log);
    });

    // When user "dislikes" the post that before had "liked"
    socket.on('remove-like-post', (payload, callback) => {
        postDisliked(payload)
            .then(() => {
                callback('Done')
                socket.broadcast.emit('post-disliked', 'Post disliked');
            })
            .catch(console.log);
    });


    // ---------- Friend requests ---------- \\
    // ° Send request °
    socket.on('friend-request', (payload, callback) => {
        const { from, to } = payload;

        sendFriendRequest(payload)
            .then((request) => {
                socket.to(to.id).emit('new-friend-request', request);
                socket.emit('friend-request-sended', request);

                callback('Sended and storaged on DB');
            })
            .catch(console.log);
    });

    // ° Denies the request °
    socket.on('denies-friend-request', (payload, callback) => {
        const { requestID } = payload;

        if (requestID === 'undefined' || requestID === undefined) {
            return console.log('No ID')

        } else if (requestID !== 'undefined' || requestID !== undefined) {
            deniesFriendRequest(requestID)
                .then((request) => {
                    socket.to(request.from.id).emit('friend-request-denied', requestID);

                    callback(request);
                })
                .catch(console.log);

        };

    })

    // ° Accept the request °
    socket.on('accept-friend-request', (payload, callback) => {
        acceptFriendRequest(payload)
            .then((request) => {
                socket.to(request.from.id).emit('friend-request-accepted', request);

                callback(request);
            })
            .catch(console.log);
    });


    // ---------- Videcall -------- \\
    socket.on('videocall-user', (props) => {
        const { userToCall: toUser, from: fromUser, roomId } = props;
        socket.join(roomId);

        // Send the notification to the user we want to contact
        socket.to(toUser).emit('incoming-videocall', { fromUser });

        // If user rejects the videocall
        socket.on('reject-call', (from) => {
            console.log(from);
            socket.to(from).emit('call-rejected');
        });

        // This is when user accepts the videocall
        socket.broadcast.to(roomId).emit('user-connected', fromUser);

        socket.on('offer', (offer, roomId) => {
            socket.broadcast.to(roomId).emit('offer', offer);
        });

        socket.on('answer', (answer, roomId) => {
            socket.broadcast.to(roomId).emit('answer', answer);
        });

        socket.on('ice-candidate', (candidate, roomId) => {
            socket.broadcast.to(roomId).emit('ice-candidate', candidate);
        });

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', toUser);
        });

    });
}


module.exports = {
    socketController
}