import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role 
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET); 
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};