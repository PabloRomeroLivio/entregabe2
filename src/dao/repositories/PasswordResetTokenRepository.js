import { passwordResetTokenModel } from '../models/passwordResetToken.model.js';

export default class PasswordResetTokenRepository {
  async create(tokenData) {
    return await passwordResetTokenModel.create(tokenData);
  }

  async findByToken(token) {
    return await passwordResetTokenModel.findOne({ token });
  }

  async deleteById(id) {
    return await passwordResetTokenModel.findByIdAndDelete(id);
  }

  async deleteByUserId(userId) {
    return await passwordResetTokenModel.deleteMany({ userId });
  }
}
