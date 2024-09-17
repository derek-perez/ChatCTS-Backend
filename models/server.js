const express = require('express');
const cors = require('cors');

const dbConnection = require('../db/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server, { cors: { origin: '*' } })

        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            messages: '/api/messages',
            posts: '/api/posts'
        }

        // Conectar a DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi app
        this.routes();

        // Sockets
        this.sockets();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.messages, require('../routes/message'));
        this.app.use(this.paths.posts, require('../routes/post'));
    }

    sockets() {
        this.io.on('connect', socketController);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;