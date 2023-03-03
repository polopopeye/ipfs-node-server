import { User } from '../schema/user.schema.js';

export const createUser = async (req, res) => {
  // language defaults to 'en'
  const { id, email, coverImg, displayName, language } = req.body;
  const user = await User.findOne({ id, email });
  if (user) {
    res.send(user);
    return;
  }

  const newUser = new User({
    id,
    email,
    coverImg,
    displayName,
    language,
  });

  await newUser.save();

  res.send(newUser);
};

export const getUser = async (req, res) => {
  const { id } = req.body;

  const user = await User.findOne({ id });
  if (!user) {
    res.status(400).send('User not found');
    return;
  }
  const { coverImg, displayName } = user;

  res.send({
    coverImg,
    displayName,
  });
};
