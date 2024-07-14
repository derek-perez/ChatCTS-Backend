const { Router } = require('express');
const { check } = require("express-validator");

const { existsMessageById } = require('../helpers/db-validators');
const validateFields = require('../middlewares/validateFields');

const { messageGet, messagesPost, messagePut, messageDelete } = require('../controllers/messages');


const router = Router();


router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsMessageById),
    validateFields
], messageGet);

router.post('/', [
    check('text', 'Text is required').not().isEmpty(),
    check('date', 'Text is required').not().isEmpty(),
    check('fromUser', 'Id incorrect - Message').isMongoId(),
    check('toUser', 'Id incorrect - Message').isMongoId(),
    validateFields
], messagesPost);

router.put('/:id', [
    check('id', 'Id incorrect - Message').isMongoId(),
    check('id').custom(existsMessageById),
    validateFields
], messagePut);

router.delete('/:id', [
    check('id', 'Id incorrect - Message').isMongoId(),
    check('id').custom(existsMessageById),
    validateFields
], messageDelete);


module.exports = router;