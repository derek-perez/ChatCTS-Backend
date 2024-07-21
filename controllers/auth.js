const bcryptjs = require('bcryptjs');

const User = require('../models/User');
const generateJWT = require('../helpers/generateJWT');


const login = async (req, res) => {
    const { email, password, stayLoggedIn } = req.body;

    try {
        const user = await User.findOne({ email });

        const checkIfStay = async () => {
            if (stayLoggedIn) {
                user.stayLoggedIn = stayLoggedIn;
                await user.save();
            } else if (!stayLoggedIn) {
                user.stayLoggedIn = stayLoggedIn;
                await user.save();
            }
        }

        // Check if email exists
        if (!user) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        // Check if password is correct
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        checkIfStay();

        res.json(user)

    } catch (error) {
        return res.status(500).json({
            msg: 'Contact the admin'
        })
    }
}

const loginEmail = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Verify email exists
        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }

        res.json(user);

    } catch (error) {
        return res.status(500).json({
            msg: 'Contacts the admin'
        })
    }

}


module.exports = {
    login,
    loginEmail
}