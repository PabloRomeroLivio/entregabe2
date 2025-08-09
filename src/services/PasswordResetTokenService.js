import crypto from 'crypto';
import PasswordResetTokenRepository from '../dao/repositories/PasswordResetTokenRepository.js';
import UserRepository from '../dao/repositories/UserRepository.js';
import { createHash } from '../utils/crypto.js';

export default class PasswordResetTokenService {
  constructor() {
    this.tokenRepository = new PasswordResetTokenRepository();
    this.userRepository = new UserRepository();
  }

  async generatePasswordResetToken(userEmail) {
    const user = await this.userRepository.findByEmail(userEmail);
    if (!user) throw new Error('No existe usuario con ese email');


    await this.tokenRepository.deleteByUserId(user._id);

    
    const token = crypto.randomBytes(32).toString('hex');

    
    await this.tokenRepository.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 3600 * 1000)
    });

    return token;
  }

  async resetPassword(token, newPassword) {
    const resetTokenDoc = await this.tokenRepository.findByToken(token);
    if (!resetTokenDoc) throw new Error('Token inválido o inexistente');

    if (resetTokenDoc.expiresAt < new Date()) {
      await this.tokenRepository.deleteById(resetTokenDoc._id);
      throw new Error('Token expirado');
    }

    
    const user = await this.userRepository.findById(resetTokenDoc.userId);
    if (!user) throw new Error('Usuario no encontrado');

    
    user.password = createHash(newPassword);
    await user.save();


    await this.tokenRepository.deleteById(resetTokenDoc._id);

    return true;
  }
}
