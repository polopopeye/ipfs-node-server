import mongoose from 'mongoose';

const IComments = {
  userId: String,
  comment: String,
  date: { type: Date, default: Date.now },
  likes: [String],
  dislikes: [String],
  reports: [String],
};

export const IReports = {
  userId: String,
  reason: String,
  date: { type: Date, default: Date.now },
  reasons: [String],
  comments: String,
};

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
  comments: [IComments],
  reports: [IReports],
  owner: String || null || undefined,
});

export const File = mongoose.model('file', fileUploadSchema);
