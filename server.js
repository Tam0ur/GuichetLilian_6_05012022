//SERVER
require('dotenv').config();
//déclaration variables 
const http = require('http');
const app = require('./app');

var helmet = require('helmet');
app.use(helmet());


const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)


//GESTION DU PORT
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0 ){
        return port;
    }
    return false;
};

//MISE EN PLACE DU PORT POUR L'APPLICATION
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//GESTION DE L'ERREUR
const errorHandler = error => {
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.adress();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port : ' + port;
    switch (error.code){
        case 'EACCES':
            console.error(bind + 'requires elevated privilages.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//CREATION DU SERVER
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port : ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);