const User = require('../models/User');
const Message = require('../models/Message');
const Post = require('../models/Post');


const emailAlreadyExists = async (email = '') => {
    const existsUserByEmail = await User.findOne({ email });

    if (existsUserByEmail) {
        throw new Error(`The email: ${email} is already registered`);
    }
}

const existsUserById = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const userExists = await User.findById(id);

        if (!userExists) {
            throw new Error(`The id ${id} does not exists`);
        }
    } else {
        throw new Error(`${id} is not a valid ID`);
    }
}

const existsMessageById = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const messageExists = await Message.findById(id);

        if (!messageExists) {
            throw new Error(`The id ${id} does not exists`);
        }
    } else {
        throw new Error(`${id} is not a valid ID`);
    }
}

const existsPostById = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const postExists = await Post.findById(id);

        if (!postExists) {
            throw new Error(`The id ${id} does not exists`);
        }
    } else {
        throw new Error(`${id} is not a valid ID`);
    }
}


module.exports = {
    emailAlreadyExists,
    existsUserById,
    existsMessageById,
    existsPostById
}