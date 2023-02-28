import {
  downloadFileFromIpfs,
  getFileFromDB,
  getFilesFromDB,
  uploadFileInfoToDB,
  uploadFileToIPFS,
} from '../service/file.service.js';
import { getStatsFile } from '../service/fileStats.service.js';

const fileController = (app, { ipfs, upload }) => {
  const controllerName = '/file';

  app.get(controllerName + '/download/:cid', async (req, res) => {
    await downloadFileFromIpfs(req, res, { ipfs });
  });

  app.post(
    controllerName + '/upload',
    upload.single('file'),
    async (req, res) => {
      await uploadFileToIPFS(req, res, { ipfs });
    }
  );

  app.post(controllerName + '/upload/:cid', async (req, res) => {
    await uploadFileInfoToDB(req, res);
  });

  app.post(controllerName + '/files', async (req, res) => {
    await getFilesFromDB(req, res);
  });

  app.get(controllerName + '/files/:cid', async (req, res) => {
    await getFileFromDB(req, res);
  });

  app.get(controllerName + '/stats/:cid', async (req, res) => {
    await getStatsFile(req, res);
  });
};

export default fileController;
