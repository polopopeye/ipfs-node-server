import fileController from './controller/file.controller.js';

export const fileModule = (app, { ipfs }) => {
  fileController(app, { ipfs });
};
