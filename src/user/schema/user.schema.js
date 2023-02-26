import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  email: String,
  coverImg: String,
  displayName: String,
  language: String,
  likes: [String],
  dislikes: [String],
  favorites: [String],
  reports: [String],
  date: { type: Date, default: Date.now },
});

export const User = mongoose.model('user', userSchema);
