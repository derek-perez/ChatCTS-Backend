const { Router } = require('express');
const { check } = require("express-validator");

const { existsPostById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const { postsGet, postGet, getPostsFromUser, postPut, postLiked, postDelete } = require('../controllers/posts');


const router = Router();

router.get('/', postsGet);

router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsPostById),
    validateFields
], postGet);

router.get('/user/:id', getPostsFromUser);

// This route is to add (or post) a new message. I'm not using it because I'm using Socket.IO to chat...
// So I cannot be doing HTTP requests to add a message...
// router.post('/', [
//     check('text', 'Text is required').not().isEmpty(),
//     check('date', 'Text is required').not().isEmpty(),
//     check('fromUser', 'Id incorrect - Message').isMongoId(),
//     validateFields
// ], postsPost);

// This route is to add (or post) a new comment on the Post. I'm not using it becuase I'm using Socket.IO
// router.put('/comment/:id', addComment);

// This route is to add a "Like" to the post liked and to the 'likedPost' field of the model 'User' on DB
// router.put('/liked/:id', postLiked);

router.put('/:id', [
    check('id', 'Id incorrect - Message').isMongoId(),
    check('id').custom(existsPostById),
    validateFields
], postPut);

router.delete('/:id', [
    check('id', 'Id incorrect - Message').isMongoId(),
    check('id').custom(existsPostById),
    validateFields
], postDelete);


module.exports = router;