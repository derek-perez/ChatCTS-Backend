const { Router } = require('express');
const { check } = require("express-validator");

const { emailAlreadyExists, existsUserById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const { userGet, usersFriendsGet, usersPost, userFriendsPut, userPut, userDelete } = require('../controllers/users');


const router = Router();

router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userGet);

router.get('/friends/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], usersFriendsGet);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must have more than 6 letters').isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(emailAlreadyExists),
    validateFields
], usersPost);

router.put('/friends/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsUserById),
    check('friendID', 'Is not a valid ID').isMongoId(),
    check('friendID').custom(existsUserById),
    validateFields
], userFriendsPut);

router.put('/:id', [
    check('id', 'Id incorrect - User').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userPut);

router.delete('/:id', [
    check('id', 'Id incorrect - User').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], userDelete);


module.exports = router;