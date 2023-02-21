import {
  uploadFileInfoToDB,
  uploadFileToIPFS,
} from '../service/file.service.js';

const fileController = (app, { ipfs, db }) => {
  const controllerName = '/file';
  app.post(controllerName + '/upload', async (req, res) => {
    await uploadFileToIPFS(req, res, { ipfs });
  });

  app.post(controllerName + '/upload/:cid', async (req, res) => {
    await uploadFileInfoToDB(req, res);
  });
};

export default fileController;
