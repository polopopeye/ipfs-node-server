import { Server } from 'socket.io';

export const socketProvider = async (http) => {
  const io = new Server(http, {
    cors: {
      origin: '*',
    },
  });

  return io;
};
