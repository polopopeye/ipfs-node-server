import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema({
  name: String || undefined || null,
  description: String || undefined || null,
  tags: [String],
  type: String,
  size: Number,
  cid: String,
  date: { type: Date, default: Date.now },
  cover: String || undefined || null,

  likes: [String],
  dislikes: [String],
  favorites: [String],
  reports: [String],
  owner: String || null || undefined,
});

export const File = mongoose.model('file', fileUploadSchema);
