import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

import './connectDb.js';
import roomRoute from '../Routes/room.js';

const httpServer = port => {
  const app = express();
  app.use(cors());
  app.use('/room', roomRoute);

  const server = createServer(app);

  app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

  server.listen(port, () => {
    console.log(`Socket is running on port http://localhost:${port}`);
  });

  return server;
};

export default httpServer;
