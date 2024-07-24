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

const getPostsFromUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    res.json(user.posts);
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

    // I don't send a response because isn't neccesary at the FrontEnd
}

const postPut = async (req, res) => {
    const id = req.params.id;
    const { _id, ...rest } = req.body;

    const post = await Post.findByIdAndUpdate(id, rest);

    res.json(post);
}

const addComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const { message, date, userID, nameUser, username, profilePicture } = req.body;

    const msg = {
        message,
        date,
        userID,
        nameUser,
        username,
        profilePicture
    }

    post.comments.push(msg);

    await post.save();

    res.json({
        msg: 'Comment added succesfully'
    })
}

const postLiked = async (req, res, io) => {
    const post = await Post.findById(req.params.id);

    post.likes += 1;

    const addPostToUserLikes = async () => {
        const { userID } = req.body;
        const user = await User.findById(userID);

        user.postsLiked.push(post._id);
        await user.save();
    }

    addPostToUserLikes();

    await post.save();

    res.json(post)
}

const postDelete = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.json(post);
}


module.exports = {
    postsGet,
    postGet,
    getPostsFromUser,
    postsPost,
    postPut,
    addComment,
    postLiked,
    postDelete
}