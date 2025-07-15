// createusuario.js

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { userModel } from './src/dao/models/user.model.js';

async function main() {
  try {
    // Conectar a MongoDB usando la URL del .env
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    // Datos del usuario de prueba
    const email = 'usuario@prueba.com';
    const password = '123456';

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log('El usuario ya existe');
      process.exit(0);
    }

    // Encriptar contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear nuevo usuario
    const newUser = new userModel({
      first_name: 'Usuario',
      last_name: 'Prueba',
      email,
      password: hashedPassword,
      age: 30,
    });

    // Guardar en DB
    await newUser.save();

    console.log('Usuario creado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario:', error);
    process.exit(1);
  }
}

main();
