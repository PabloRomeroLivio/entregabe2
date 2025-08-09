export default class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.buyer = ticket.buyer;
    this.products = ticket.products.map(p => ({
      product: p.product,
      quantity: p.quantity,
      price: p.price
    }));
    this.amount = ticket.amount;
    this.purchase_datetime = ticket.purchase_datetime;
  }
}
