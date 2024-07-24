const { Router } = require('express');
const { check } = require("express-validator");

const { existsPostById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const { postsGet, postGet, getPostsFromUser, postsPost, postPut, postLiked, postDelete, addComment } = require('../controllers/posts');


const router = Router();

router.get('/', postsGet);

router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsPostById),
    validateFields
], postGet);

router.get('/user/:id', getPostsFromUser);

// This route is to add (or post) a new message, but I'm not using it because I'm using Socket.IO to chat...
// So I cannot be doing HTTP requests to add a message...
// router.post('/', [
//     check('text', 'Text is required').not().isEmpty(),
//     check('date', 'Text is required').not().isEmpty(),
//     check('fromUser', 'Id incorrect - Message').isMongoId(),
//     validateFields
// ], postsPost);

router.put('/comment/:id', addComment);

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

module.exports = (io) => {
    router.put('/liked/:id', (req, res) => postLiked(req, res, io));

    return router;
}