import {
  dislikeNewFile,
  fevoriteNewFile,
  likeNewFile,
  undislikeNewFile,
  unfavoriteNewFile,
  unlikeNewFile,
} from '../service/fileOptions.service.js';

const fileOptionsController = (app) => {
  const controllerName = '/user';
  app.post(controllerName + '/like/:cid', async (req, res) => {
    await likeNewFile(req, res);
  });

  app.post(controllerName + '/unlike/:cid', async (req, res) => {
    await unlikeNewFile(req, res);
  });

  app.post(controllerName + '/dislike/:cid', async (req, res) => {
    await dislikeNewFile(req, res);
  });

  app.post(controllerName + '/undislike/:cid', async (req, res) => {
    await undislikeNewFile(req, res);
  });

  app.post(controllerName + '/favorite/:cid', async (req, res) => {
    await fevoriteNewFile(req, res);
  });

  app.post(controllerName + '/unfavorite/:cid', async (req, res) => {
    await unfavoriteNewFile(req, res);
  });
};

export default fileOptionsController;
