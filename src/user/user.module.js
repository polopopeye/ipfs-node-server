import fileOptionsController from './controller/fileOptions.controller.js';
import userController from './controller/user.controller.js';

export const userModule = (app) => {
  userController(app);
  fileOptionsController(app);
};
