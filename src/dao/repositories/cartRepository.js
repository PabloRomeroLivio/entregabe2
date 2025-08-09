import { cartModel } from '../models/cartModel.js';

class CartRepository {
    async getAll() {
        return await cartModel.find();
    }

    async getById(id) {
        const cart = await cartModel.findById(id).populate('products.product');
        if (!cart) throw new Error(`Carrito con id ${id} no encontrado`);
        return cart;
    }

    async create() {
        return await cartModel.create({ products: [] });
    }

    async update(id, updatedCart) {
        const cart = await cartModel.findByIdAndUpdate(id, updatedCart, { new: true });
        if (!cart) throw new Error(`Carrito con id ${id} no encontrado`);
        return cart;
    }

    async delete(id) {
        const cart = await cartModel.findByIdAndDelete(id);
        if (!cart) throw new Error(`Carrito con id ${id} no encontrado`);
        return cart;
    }
}

export default CartRepository;
