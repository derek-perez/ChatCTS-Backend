const { Router } = require('express');
const { check } = require("express-validator");

const { usernameAlreadyExists, existsUserById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const {
    userGet,
    usersFriendsGet,
    getFriendRequests,
    usersPost,
    userPut,
    userNtfSubscription,
    userDelete,
    getUserByUsername
} = require('../controllers/users');


const router = Router();

router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userGet);

router.get('/username/:username', getUserByUsername);

router.get('/friends/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], usersFriendsGet);

// Friend requests \\
router.get('/friendrequests/:id', getFriendRequests);
// Friend requests \\

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('username').custom(usernameAlreadyExists),
    validateFields
], usersPost);

// Add a friend is being managed by Socket.IO.
// router.put('/friends/:id', [
//     check('id', 'Is not a valid ID').isMongoId(),
//     check('id').custom(existsUserById),
//     check('friendID', 'Is not a valid ID').isMongoId(),
//     check('friendID').custom(existsUserById),
//     validateFields
// ], userFriendsPut);

router.put('/:id', [
    check('id', 'Id incorrect - User').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userPut);

// Storage the subscription for the notifications
router.put('/subscription/:email', [
    check('email', 'Email is not correct').isEmail(),
    validateFields
], userNtfSubscription);

router.delete('/:id', [
    check('id', 'Id incorrect - User').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userDelete);


module.exports = router;