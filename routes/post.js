const { Router } = require('express');
const { check } = require("express-validator");

const { existsPostById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const { postsGet, postGet, postsPost, postPut, postDelete } = require('../controllers/posts');


const router = Router();

router.get('/', postsGet);

router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsPostById),
    validateFields
], postGet);

router.post('/', [
    check('text', 'Text is required').not().isEmpty(),
    check('date', 'Text is required').not().isEmpty(),
    check('fromUser', 'Id incorrect - Message').isMongoId(),
    validateFields
], postsPost);

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