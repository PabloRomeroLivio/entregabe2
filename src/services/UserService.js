import UserRepository from '../dao/repositories/UserRepository.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import config from '../config/config.js';
import { cartModel } from '../dao/models/cartModel.js';
import crypto from 'crypto';
import { PasswordResetTokenModel } from '../dao/models/passwordResetToken.model.js';

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const { first_name, last_name, email, age, password } = userData;

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error('Todos los campos son obligatorios');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const cart = await cartModel.create({ products: [] });

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart._id,
      role: email === config.ADMIN_EMAIL ? 'admin' : 'user',
    };

    return await this.userRepository.create(newUser);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !isValidPassword(user, password)) {
      throw new Error('Credenciales inválidas');
    }
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async deleteUserById(id) {
    return await this.userRepository.deleteById(id);
  }

  // 

  /**
   * 
   * 
   * @param {string} email 
   * @returns {string} token
   */
  async generatePasswordResetToken(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); 
    
    await PasswordResetTokenModel.findOneAndDelete({ userId: user._id });

    
    await PasswordResetTokenModel.create({ userId: user._id, token, expiresAt });

    return token;
  }

  /**
   
   
   * @param {string} token 
   * @param {string} newPassword 
   */
  async resetPassword(token, newPassword) {
    const resetRecord = await PasswordResetTokenModel.findOne({ token });
    if (!resetRecord) throw new Error('Token inválido o expirado');

    if (resetRecord.expiresAt < new Date()) {
      await PasswordResetTokenModel.deleteOne({ token });
      throw new Error('Token expirado');
    }

    const user = await this.userRepository.findById(resetRecord.userId);
    if (!user) throw new Error('Usuario no encontrado');

    user.password = createHash(newPassword);
    await user.save();

    await PasswordResetTokenModel.deleteOne({ token });

    return true;
  }
}
