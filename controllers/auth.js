const bcryptjs = require('bcryptjs');

const User = require('../models/User');
const generateJWT = require('../helpers/generateJWT');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if email exists
        if (!user) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        // Check if password is correct
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        // Generar el JWT
        const token = await generateJWT(usuario._id);

        res.json({
            user,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Contact the admin'
        })
    }
}


module.exports = {
    login
}