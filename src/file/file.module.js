import fileController from './controller/file.controller.js';

export const fileModule = (app, { ipfs, db }) => {
  fileController(app, { ipfs, db });
};
