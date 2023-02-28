import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import appModule from './src/app.module.js';
import EventEmitter from 'events';
import multer from 'multer';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';

const bootstrap = async () => {
  process.setMaxListeners(0);
  console.log(
    `fastlog => process.getMaxListeners()`,
    process.getMaxListeners()
  );
  EventEmitter.defaultMaxListeners = 0;
  EventEmitter.setMaxListeners(0);

  const emitter = new EventEmitter();
  emitter.setMaxListeners(0);
  emitter.defaultMaxListeners = 0;

  const app = express();
  app.setMaxListeners(0);

  const upload = multer({ dest: 'uploads' });

  app.use(bodyParser.json({ limit: '50000mb' }));

  app.use(cors());
  dotenv.config();
  const port = process.env.PORT; //IPFS_PORT;

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  await appModule(app, { upload, io });

  httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

bootstrap();
