const { Router } = require('express');
const { check } = require('express-validator');

const { login, loginEmail } = require('../controllers/auth');

const validateFields = require('../middlewares/validateFields');

const router = Router();


router.post('/login', [
    check('email', 'El correo es obligatario').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.post('/userStay', loginEmail);


module.exports = router;