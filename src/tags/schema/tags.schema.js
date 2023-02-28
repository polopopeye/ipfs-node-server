import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: String,
  mode: String,
  numberPosts: Number,
  date: { type: Date, default: Date.now },
  owner: String || null || undefined,
});

export const Tag = mongoose.model('tag', TagSchema);
