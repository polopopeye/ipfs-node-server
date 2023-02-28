import {
  createOrUpdateTag,
  getTagFromDB,
  getTagsFromDB,
} from '../service/tags.service.js';

const tagsController = (app) => {
  const controllerName = '/tag';

  app.post(controllerName + '/create/', async (req, res) => {
    await createOrUpdateTag(req, res);
  });

  app.get(controllerName + '/tags', async (req, res) => {
    await getTagsFromDB(req, res);
  });

  app.post(controllerName + '/tags/:id', async (req, res) => {
    await getTagFromDB(req, res);
  });
};

export default tagsController;
