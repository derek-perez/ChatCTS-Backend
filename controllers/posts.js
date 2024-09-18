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
    const { text, date, fromUser } = req;

    const post = new Post({ text, date, fromUser });

    await post.save();

    const addPostToUser = async () => {
        const user = await User.findById(fromUser);

        const newPost = await Post.findOne({ text });

        user.posts.push(newPost._id);

        await user.save();
    }

    addPostToUser();

    return post;
}

const postPut = async (req, res) => {
    const id = req.params.id;
    const { _id, ...rest } = req.body;

    const post = await Post.findByIdAndUpdate(id, rest);

    res.json(post);
}

const addComment = async (req) => {
    const { postSelected, message, date, userID, nameUser, username, profilePicture } = req;
    const post = await Post.findById(postSelected);

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

    return msg;
}

const postLiked = async (req) => {
    const { postID, userID } = req;
    const post = await Post.findById(postID);

    post.likes += 1;

    const addPostToUserLikes = async () => {
        const user = await User.findById(userID);

        user.postsLiked.push(post._id);
        await user.save();
    }

    addPostToUserLikes();

    await post.save();

    // I don't send a response because isn't neccesary at the FrontEnd
}

const postDisliked = async (req) => {
    const { postID, userID } = req;
    const post = await Post.findById(postID);

    post.likes -= 1;

    const removePostFromUserLikes = async () => {
        const user = await User.findById(userID);

        // user.postsLiked.push(post._id);
        const indexToRemove = user.postsLiked.indexOf(post);
        user.postsLiked.splice(indexToRemove, 1);

        await user.save();
    }

    removePostFromUserLikes();

    await post.save();

    // I don't send a response because isn't neccesary at the FrontEnd
}

const postDelete = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.json(post);
}

// This is for the search of posts
const getPostsFromSearch = (req, res) => {
    const searchTerm = req.params.search;

    Post.find({ text: { $regex: searchTerm, $options: 'i' } })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            console.error('Error al buscar posts:', err);
        });
}


module.exports = {
    postsGet,
    postGet,
    getPostsFromUser,
    postsPost,
    postPut,
    addComment,
    postLiked,
    postDisliked,
    postDelete,
    getPostsFromSearch
}