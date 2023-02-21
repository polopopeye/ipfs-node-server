import ipfsController from './controllers/ipfs.controller.js';
import { ipfsProvider } from './provider/ipfs.provider.js';

const ipfsModule = async (app) => {
  const ipfs = await ipfsProvider();
  ipfsController(app, { ipfs });
  return { ipfs };
};

export default ipfsModule;
