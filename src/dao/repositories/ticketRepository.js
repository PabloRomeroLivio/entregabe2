import ticketModel from '../models/ticketModel.js';

export default class TicketRepository {
  async create(ticketData) {
    return await ticketModel.create(ticketData);
  }

  async findById(id) {
    return await ticketModel.findById(id);
  }

  async findByBuyer(buyerId) {
    return await ticketModel.find({ buyer: buyerId });
  }

  async findAll() {
    return await ticketModel.find();
  }

  async deleteById(id) {
    return await ticketModel.findByIdAndDelete(id);
  }
}
