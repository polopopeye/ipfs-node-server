import { socketProvider } from './provider/socket.provider.js';

export const socketModule = async (http) => {
  const io = await socketProvider(http);
  return io;
};
