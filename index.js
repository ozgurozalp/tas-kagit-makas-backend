import httpServer from './helpers/httpServer.js';
import socketServer from './helpers/socketServer.js';

const PORT = process.env.PORT || 5000;

const server = httpServer(PORT);
socketServer(server);
