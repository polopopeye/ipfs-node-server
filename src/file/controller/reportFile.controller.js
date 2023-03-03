import {
  createReportFile,
  deleteReportFile,
} from '../service/report.service.js';

const reportFileController = (app) => {
  const controllerName = '/report';

  app.post(controllerName + '/create', async (req, res) => {
    await createReportFile(req, res);
  });

  app.post(controllerName + '/delete', async (req, res) => {
    await deleteReportFile(req, res);
  });
};

export default reportFileController;
