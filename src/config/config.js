import dotenv from 'dotenv';
dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL,
  // ... otras variables si tenés
};
