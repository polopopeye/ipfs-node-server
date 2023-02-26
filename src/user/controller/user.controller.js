import { createUser } from '../service/user.service.js';

const userController = (app) => {
  const controllerName = '/user';
  app.post(controllerName + '/create', async (req, res) => {
    await createUser(req, res);
  });
};

export default userController;
