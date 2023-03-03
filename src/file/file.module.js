import commentFileController from './controller/commentFile.controller.js';
import fileController from './controller/file.controller.js';
import reportFileController from './controller/reportFile.controller.js';

export const fileModule = (app, { ipfs, io, upload }) => {
  fileController(app, { ipfs, io, upload });
  commentFileController(app);
  reportFileController(app);
};
