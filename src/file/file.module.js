import fileController from './controller/file.controller.js';

export const fileModule = (app, { ipfs, upload }) => {
  fileController(app, { ipfs, upload });
};
