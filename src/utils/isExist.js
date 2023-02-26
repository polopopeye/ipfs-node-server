import { File } from '../file/schema/file.schema.js';
import { User } from '../user/schema/user.schema.js';

export const isUserExist = async ({ id, email }, res) => {
  const user = await User.findOne({ id, email });

  if (!user) {
    res.status(400).send('User not found');
    return false;
  }

  return user;
};

export const isFileExist = async (cid, res) => {
  const file = await File.findOne({ cid });

  if (!file) {
    res.status(400).send('File not found');
    return false;
  }

  return file;
};
