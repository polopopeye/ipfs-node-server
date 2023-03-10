import appController from './app.controller.js';
import { mongoConnection } from './database/mongo.provider.js';
import { fileModule } from './file/file.module.js';
import ipfsModule from './ipfs/ipfs.module.js';
import { socketModule } from './socket/socket.module.js';
import { tagsModule } from './tags/tags.module.js';
import { userModule } from './user/user.module.js';

const appModule = async (app, { upload, io }) => {
  await mongoConnection();

  appController(app);

  //   imported modules
  const { ipfs } = await ipfsModule(app);

  fileModule(app, { ipfs, io, upload });
  userModule(app);
  tagsModule(app);
};

export default appModule;
