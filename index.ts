import * as http from 'http';
import api from './src/api';
import * as config from './src/config';

// Set the port to the API.
api.set('port', config.port);

// Create an HTTP server based on Express
const server: http.Server = http.createServer(api);

// Connect to the database; then start the server
server.listen(config.port);

server.on('listening', () => {
    console.log(`API is running in port ${config.port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use.`);
    } else {
        console.error('Error in the server', err.message);
    }

    process.exit(1); // Exit with a non-zero status code to indicate an error
});
