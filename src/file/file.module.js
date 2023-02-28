import fileController from './controller/file.controller.js';

export const fileModule = (app, { ipfs, io, upload }) => {
  fileController(app, { ipfs, io, upload });
};
