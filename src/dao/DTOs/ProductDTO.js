export default class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.category = product.category;
    this.stock = product.stock;
    this.code = product.code;
    this.status = product.status;
    this.thumbnail = product.thumbnail;
  }
}
