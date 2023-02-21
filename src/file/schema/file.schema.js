import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  type: String,
  size: Number,
  cid: String,
  date: { type: Date, default: Date.now },
});

export const File = mongoose.model('file', fileUploadSchema);
