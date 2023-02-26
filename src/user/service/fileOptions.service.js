import { isFileExist, isUserExist } from '../../utils/isExist.js';

export const likeNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const likes = user.likes;
  const likesFile = file.likes;

  if (likes.includes(cid)) {
    const index = likes.indexOf(cid);
    likes.splice(index, 1);
    user.likes = likes;
    await user.save();
  }

  if (likesFile.includes(id)) {
    const indexFile = likesFile.indexOf(id);
    likesFile.splice(indexFile, 1);
    file.likes = likesFile;
    await file.save();
  }

  likes.push(cid);
  user.likes = likes;
  await user.save();

  likesFile.push(id);
  file.likes = likesFile;
  await file.save();

  res.send({
    likes: user.likes,
  });
  return;
};

export const unlikeNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const likes = user.likes;
  const likesFile = file.likes;

  if (!likes.includes(cid)) {
    likes.push(cid);
    user.likes = likes;
    await user.save();
  }

  if (!likesFile.includes(id)) {
    likesFile.push(id);
    file.likes = likesFile;
    await file.save();
  }

  const index = likes.indexOf(cid);
  likes.splice(index, 1);
  user.likes = likes;
  await user.save();

  const indexFile = likesFile.indexOf(id);
  likesFile.splice(indexFile, 1);
  file.likes = likesFile;
  await file.save();

  res.send({
    likes: user.likes,
  });
  return;
};

export const dislikeNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const dislikes = user.dislikes;
  const dislikesFile = file.dislikes;

  if (dislikes.includes(cid)) {
    const index = dislikes.indexOf(cid);
    dislikes.splice(index, 1);
    user.dislikes = dislikes;
    await user.save();
  }

  if (dislikesFile.includes(id)) {
    const indexFile = dislikesFile.indexOf(id);
    dislikesFile.splice(indexFile, 1);
    file.dislikes = dislikesFile;
    await file.save();
  }

  dislikes.push(cid);
  user.dislikes = dislikes;
  await user.save();

  dislikesFile.push(id);
  file.dislikes = dislikesFile;
  await file.save();

  res.send({
    dislikes: user.dislikes,
  });
  return;
};

export const undislikeNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const dislikes = user.dislikes;
  const dislikesFile = file.dislikes;

  if (!dislikes.includes(cid)) {
    dislikes.push(cid);
    user.dislikes = dislikes;
    await user.save();
  }

  if (!dislikesFile.includes(id)) {
    dislikesFile.push(id);
    file.dislikes = dislikesFile;
    await file.save();
  }

  const index = dislikes.indexOf(cid);
  dislikes.splice(index, 1);
  user.dislikes = dislikes;
  await user.save();

  const indexFile = dislikesFile.indexOf(id);
  dislikesFile.splice(indexFile, 1);
  file.dislikes = dislikesFile;
  await file.save();

  res.send({
    dislikes: user.dislikes,
  });
  return;
};

export const fevoriteNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const favorites = user.favorites;
  const favoritesFile = file.favorites;

  if (favorites.includes(cid)) {
    const index = favorites.indexOf(cid);
    favorites.splice(index, 1);
    user.favorites = favorites;
    await user.save();
  }

  if (favoritesFile.includes(id)) {
    const indexFile = favoritesFile.indexOf(id);
    favoritesFile.splice(indexFile, 1);
    file.favorites = favoritesFile;
    await file.save();
  }

  favorites.push(cid);
  user.favorites = favorites;
  await user.save();

  favoritesFile.push(id);
  file.favorites = favoritesFile;
  await file.save();

  res.send({
    favorites: user.favorites,
  });
  return;
};

export const unfavoriteNewFile = async (req, res) => {
  const { cid } = req.params;
  const { id, email } = req.body;

  const user = await isUserExist({ id, email }, res);
  if (!user) return;
  const file = await isFileExist(cid, res);
  if (!file) return;

  const favorites = user.favorites;
  const favoritesFile = file.favorites;

  if (!favorites.includes(cid)) {
    favorites.push(cid);
    user.favorites = favorites;
    await user.save();
  }

  if (!favoritesFile.includes(id)) {
    favoritesFile.push(id);
    file.favorites = favoritesFile;
    await file.save();
  }

  const index = favorites.indexOf(cid);
  favorites.splice(index, 1);
  user.favorites = favorites;
  await user.save();

  const indexFile = favoritesFile.indexOf(id);
  favoritesFile.splice(indexFile, 1);
  file.favorites = favoritesFile;
  await file.save();

  res.send({
    favorites: user.favorites,
  });
  return;
};
