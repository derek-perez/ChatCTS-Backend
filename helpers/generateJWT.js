const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, (err, token) => {
            if (err) {
                console.log(err);
                reject("Wasn't able to generate the JWT");
            } else {
                resolve(token);
            }
        })

    });

}

const comprobeJWT = async (token = '') => {

    try {

        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if (user) {
            return user;

        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}


module.exports = {
    generateJWT,
    comprobeJWT
};