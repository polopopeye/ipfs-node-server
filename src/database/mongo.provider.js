import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

export const mongoConnection = async () => {
  dotenv.config();

  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return db;
};
