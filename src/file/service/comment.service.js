import { isFileExist } from '../../utils/isExist.js';
import { uuid } from 'uuidv4';

export const createCommentFile = async (req, res) => {
  const { cid, userId, comment } = req.body;

  const file = await isFileExist(cid, res);
  if (!file) return;

  file.comments.push({
    id: uuid(),
    userId,
    comment,
    date: new Date(),
  });

  await file.save();

  res.send({
    status: 'success',
    message: 'Comment created',
    comments: file.comments,
  });

  return;
};

export const deleteCommentFile = async (req, res) => {
  const { userId, commentId: id, cid } = req.body;

  const file = await isFileExist(cid, res);
  if (!file) return;

  const comment = file.comments.find((comment) => comment.id === id);
  if (!comment) {
    res.status(400).send('Comment not found');
    return;
  }

  if (comment.userId !== userId) {
    res.status(400).send('User not authorized');
    return;
  }

  file.comments = file.comments.filter((comment) => comment.id !== id);

  await file.save();

  res.send({
    status: 'success',
    message: 'Comment deleted',
    comments: file.comments,
  });

  return;
};

export const getCommentsFile = async (req, res) => {
  const { cid } = req.body;

  const file = await isFileExist(cid, res);
  if (!file) return;

  file.comments = file.comments.sort((a, b) => b.date - a.date);

  res.send({
    status: 'success',
    message: 'Comments found',
    comments: file.comments,
  });

  return;
};
