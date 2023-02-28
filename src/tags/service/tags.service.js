import { isTagExist } from '../../utils/isExist.js';
import { Tag } from '../schema/tags.schema.js';

export const createOrUpdateTag = async (req, res) => {
  const { name, mode, owner } = req.body;

  if (!name || !mode) {
    res.status(400).send('Missing tag info');
    return;
  }

  const exisTags = await isTagExist(mode);

  if (exisTags) {
    exisTags.numberPosts += 1;
    const result = await exisTags.save();
    res.send(result);
    return;
  }

  const tag = new Tag({
    name,
    mode,
    owner,
    numberPosts: 1,
  });

  const result = await tag.save();

  res.send(result);
};

export const getTagsFromDB = async (req, res) => {
  const tags = await Tag.find();
  res.send(tags);
};

export const getTagFromDB = async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findById(id);

  if (!tag) {
    res.status(400).send('Tag not found');
    return;
  }

  res.send(tag);
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name, mode, owner, numberPosts } = req.body;

  if (!name || !mode) {
    res.status(400).send('Missing tag info');
    return;
  }

  const tag = await Tag.findById(id);

  if (!tag) {
    res.status(400).send('Tag not found');
    return;
  }

  if (name) tag.name = name;
  if (mode) tag.mode = mode;
  if (owner) tag.owner = owner;
  if (numberPosts) tag.numberPosts = numberPosts;

  const result = await tag.save();

  res.send(result);
};

export const getTagStats = async (req, res) => {
  const tags = await Tag.find();
  // const files = await File.find();
  const stats = tags.map((tag) => {
    return {
      name: tag.name,
      numberPosts: tag.numberPosts,
    };
  });

  res.send(stats);
};
