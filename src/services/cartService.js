import { cartModel } from '../dao/models/cartModel.js';
import { productDBManager } from '../dao/productDBManager.js';
import ticketModel from '../dao/models/ticketModel.js'; // Import default según ticketModel.js

class CartService {
  constructor() {
    this.productService = new productDBManager();
  }

  async getAllCarts() {
    return cartModel.find();
  }

  async getProductsFromCartByID(cid) {
    const cart = await cartModel.findOne({ _id: cid }).populate('products.product');

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    return cart;
  }

  async createCart() {
    return await cartModel.create({ products: [] });
  }

  async addProductByID(cid, pid) {
    await this.productService.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    let i = null;
    const found = cart.products.filter((item, index) => {
      if (item.product.toString() === pid) i = index;
      return item.product.toString() === pid;
    });

    if (found.length > 0) {
      cart.products[i].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cartModel.updateOne({ _id: cid }, { products: cart.products });

    return await this.getProductsFromCartByID(cid);
  }

  async deleteProductByID(cid, pid) {
    await this.productService.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const newProducts = cart.products.filter(item => item.product.toString() !== pid);

    await cartModel.updateOne({ _id: cid }, { products: newProducts });

    return await this.getProductsFromCartByID(cid);
  }

  async updateAllProducts(cid, products) {
    for (const p of products) {
      await this.productService.getProductByID(p.product);
    }

    await cartModel.updateOne({ _id: cid }, { products });

    return await this.getProductsFromCartByID(cid);
  }

  async updateProductByID(cid, pid, quantity) {
    if (!quantity || isNaN(parseInt(quantity))) throw new Error('La cantidad ingresada no es válida!');

    await this.productService.getProductByID(pid);

    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    let i = null;
    const found = cart.products.filter((item, index) => {
      if (item.product.toString() === pid) i = index;
      return item.product.toString() === pid;
    });

    if (found.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

    cart.products[i].quantity = parseInt(quantity);

    await cartModel.updateOne({ _id: cid }, { products: cart.products });

    return await this.getProductsFromCartByID(cid);
  }

  async deleteAllProducts(cid) {
    await cartModel.updateOne({ _id: cid }, { products: [] });

    return await this.getProductsFromCartByID(cid);
  }

  // Método para concretar la compra
  async purchaseCart(cid, buyerId) {
    const cart = await cartModel.findById(cid).populate('products.product');
    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    const productsPurchased = [];
    const productsOutOfStock = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        productsPurchased.push(item);
      } else {
        productsOutOfStock.push(item);
      }
    }

    if (productsPurchased.length === 0) {
      throw new Error('No hay productos disponibles para comprar por falta de stock.');
    }

    const amount = productsPurchased.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    // Creo el ticket con las propiedades que definiste en ticketModel.js
    const ticket = await ticketModel.create({
      buyer: buyerId,
      products: productsPurchased.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      amount,
      purchase_datetime: new Date()
    });

    // Actualizo el carrito con los productos que no se compraron (sin stock suficiente)
    cart.products = productsOutOfStock;
    await cart.save();

    return { ticket, remainingCart: cart };
  }
}

export default CartService;
