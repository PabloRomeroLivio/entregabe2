import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './src/dao/models/user.model.js';
import { createHash } from './src/utils/crypto.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const createUser = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado a MongoDB');

    const newUser = {
      first_name: 'Pablo',
      last_name: 'Admin',
      email: 'admin@admin.com',
      age: 30, // 👈 NECESARIO
      password: createHash('admin123'),
      role: 'admin',
    };

    const result = await userModel.create(newUser);
    console.log('✅ Usuario creado:', result);
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUser();
