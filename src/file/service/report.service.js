import { isFileExist } from '../../utils/isExist.js';
import { uuid } from 'uuidv4';

export const createReportFile = async (req, res) => {
  const { cid, userId, comments, reasons } = req.body;

  const file = await isFileExist(cid, res);
  if (!file) return;

  // find if user already reported this file
  const report = file.reports.find((report) => report.userId === userId);

  // if user already reported this file
  if (report) {
    // update reasons and comment
    report.reasons = reasons;
    report.comments = comments;
  } else {
    // else create new report
    file.reports.push({
      id: uuid(),
      userId,
      comments,
      reasons,
    });
  }

  await file.save();

  res.send({
    status: 'success',
    message: 'Report created',
    reports: file.reports,
  });

  return;
};

export const deleteReportFile = async (req, res) => {
  const { userId, reportId: id, cid } = req.body;

  const file = await isFileExist(cid, res);
  if (!file) return;

  const report = file.reports.find((report) => report.id === id);
  if (!report) {
    res.status(400).send('Report not found');
    return;
  }

  if (report.userId !== userId) {
    res.status(400).send('User not authorized');
    return;
  }

  file.reports = file.reports.filter((report) => report.id !== id);

  await file.save();

  res.send({
    status: 'success',
    message: 'Report deleted',
    reports: file.reports,
  });

  return;
};
