import appController from './app.controller.js';
import { mongoConnection } from './database/mongo.provider.js';
import { fileModule } from './file/file.module.js';
import ipfsModule from './ipfs/ipfs.module.js';

const appModule = async (app) => {
  const db = await mongoConnection();
  appController(app);

  //   imported modules
  const { ipfs } = await ipfsModule(app);
  fileModule(app, { ipfs, db });
};

export default appModule;
