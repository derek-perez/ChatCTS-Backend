const Post = require('../models/Post');
const User = require('../models/User');

const postsGet = async (req, res) => {
    const posts = await Promise.all([Post.find()]);

    res.json(posts);
}

const postGet = async (req, res) => {
    const post = await Post.findById(req.params.id);

    res.json(post);
}

const postsPost = async (req, res) => {
    const { text, date, fromUser } = req.body;
    const post = new Post({ text, date, fromUser });

    await post.save();

    const addPostToUser = async () => {
        const user = await User.findById(fromUser);

        const newPost = await Post.findOne({ text });

        user.posts.push(newPost._id);

        await user.save();
    }

    addPostToUser();

    res.json(post)
}

const postPut = async (req, res) => {
    const id = req.params.id;
    const { _id, ...rest } = req.body;

    const post = await Post.findByIdAndUpdate(id, rest);

    res.json(post);
}

const postDelete = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.json(post);
}


module.exports = {
    postsGet,
    postGet,
    postsPost,
    postPut,
    postDelete
}