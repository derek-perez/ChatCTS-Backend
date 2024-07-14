const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '8h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("Wasn't able to generate the JWT");
            } else {
                resolve(token);
            }
        })

    });

}


module.exports = generateJWT;