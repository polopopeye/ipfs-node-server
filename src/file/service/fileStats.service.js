import { isFileExist } from '../../utils/isExist.js';

export const getStatsFile = async (req, res) => {
  const { cid } = req.params;

  const file = await isFileExist(cid, res);
  if (!file) return;

  res.send({
    likes: file.likes,
    dislikes: file.dislikes,
    reports: file.reports,
    favorites: file.favorites,
  });
  return;
};
