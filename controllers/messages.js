const Message = require('../models/Message');
const User = require('../models/User');


const messageGet = async (req, res) => {
    const message = await Message.findById(req.params.id);

    res.json(message);
}

const messagesPost = async (req, res) => {
    const { text, date, fromUser, toUser } = req.body;
    const message = new Message({ text, date, fromUser, toUser });

    await message.save();

    const addMessageToUser = async () => {
        const userMain = await User.findById(fromUser);
        const userFriend = await User.findById(toUser);
        
        const msg = await Message.findOne({ text });
        
        userMain.messages.push(msg._id);
        userFriend.messages.push(msg._id);
        
        await userMain.save();
        await userFriend.save();
    }

    addMessageToUser();

    res.json({
        msg: 'Sended'
    });
}

const messagePut = async (req, res) => {
    const id = req.params.id;
    const { _id, ...rest } = req.body;

    const message = await Message.findByIdAndUpdate(id, rest);

    res.json(message);
}

const messageDelete = async (req, res) => {
    const message = await Message.findByIdAndDelete(req.params.id);

    res.json(message);
}


module.exports = {
    messageGet,
    messagesPost,
    messagePut,
    messageDelete
}