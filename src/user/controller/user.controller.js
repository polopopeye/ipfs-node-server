import { createUser, getUser } from '../service/user.service.js';

const userController = (app) => {
  const controllerName = '/user';
  app.post(controllerName + '/create', async (req, res) => {
    await createUser(req, res);
  });

  app.post(controllerName + '/get', async (req, res) => {
    await getUser(req, res);
  });
};

export default userController;
