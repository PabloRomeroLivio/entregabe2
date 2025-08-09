import dotenv from 'dotenv';
dotenv.config();

export default {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'claveSuperSecreta123',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'pablo.romero.livio@gmail.com',
};
