import { userModel } from '../models/user.model.js';

export default class UserRepository {
  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async findById(id) {
    return await userModel.findById(id);
  }

  async create(userData) {
    return await userModel.create(userData);
  }

  async findAll() {
    return await userModel.find();
  }

  async updateById(id, update) {
    return await userModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id) {
    return await userModel.findByIdAndDelete(id);
  }
}
