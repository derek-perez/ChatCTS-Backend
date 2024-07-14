const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Bases de datos online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la DB');
    }

}

module.exports = dbConnection;