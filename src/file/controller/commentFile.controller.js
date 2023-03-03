import {
  createCommentFile,
  deleteCommentFile,
  getCommentsFile,
} from '../service/comment.service.js';

const commentFileController = (app) => {
  const controllerName = '/comment';

  app.post(controllerName + '/create', async (req, res) => {
    await createCommentFile(req, res);
  });

  app.post(controllerName + '/get', async (req, res) => {
    await getCommentsFile(req, res);
  });

  app.post(controllerName + '/delete', async (req, res) => {
    await deleteCommentFile(req, res);
  });
};

export default commentFileController;
