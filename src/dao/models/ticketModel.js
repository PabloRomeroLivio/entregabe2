import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  purchase_datetime: { type: Date, default: Date.now }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);
export default TicketModel;
