import { cartModel } from "./models/cartModel.js";
import TicketModel from "./models/ticketModel.js"; 

class cartDBManager {
    constructor(productDBManager) {
        this.productDBManager = productDBManager;
    }

    async getAllCarts() {
        return cartModel.find();
    }

    async getCartById(cid) {
        const cart = await cartModel.findById(cid).populate('products.product');
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        return cart;
    }

    async createCart() {
        return await cartModel.create({ products: [] });
    }

    async addProductByID(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const index = cart.products.findIndex(item => item.product.toString() === pid);

        if (index !== -1) {
            cart.products[index].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return await this.getCartById(cid);
    }

    async deleteProductByID(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = cart.products.filter(item => item.product.toString() !== pid);

        await cart.save();
        return await this.getCartById(cid);
    }

    async updateAllProducts(cid, products) {
        for (const item of products) {
            await this.productDBManager.getProductByID(item.product);
        }

        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = products;
        await cart.save();

        return await this.getCartById(cid);
    }

    async updateProductByID(cid, pid, quantity) {
        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        const index = cart.products.findIndex(item => item.product.toString() === pid);
        if (index === -1) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        cart.products[index].quantity = parseInt(quantity);

        await cart.save();
        return await this.getCartById(cid);
    }

    async deleteAllProducts(cid) {
        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        cart.products = [];
        await cart.save();

        return await this.getCartById(cid);
    }

   
    async purchaseCart(cid, buyerId) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        if (!cart.products.length) throw new Error('El carrito está vacío');

        const productsNotPurchased = [];
        let totalAmount = 0;
        const productsToBuy = [];

      
        for (const item of cart.products) {
            const product = await this.productDBManager.getProductByID(item.product._id.toString());

            if (!product) {
                productsNotPurchased.push({ productId: item.product._id, reason: 'Producto no encontrado' });
                continue;
            }

            if (product.stock >= item.quantity) {
                productsToBuy.push({
                    product,
                    quantity: item.quantity,
                    price: product.price
                });
            } else if (product.stock > 0) {
                productsNotPurchased.push({
                    productId: item.product._id,
                    reason: `Stock insuficiente. Disponible: ${product.stock}`
                });
            } else {
                productsNotPurchased.push({
                    productId: item.product._id,
                    reason: 'Producto sin stock'
                });
            }
        }

        if (!productsToBuy.length) {
            throw new Error('No hay productos disponibles para la compra');
        }

     
        for (const item of productsToBuy) {
            await this.productDBManager.updateStock(item.product._id, item.product.stock - item.quantity);
            totalAmount += item.price * item.quantity;
        }

      
        const ticket = await TicketModel.create({
            buyer: buyerId,
            products: productsToBuy.map(p => ({
                product: p.product._id,
                quantity: p.quantity,
                price: p.price
            })),
            amount: totalAmount,
            purchase_datetime: new Date()
        });

       
        cart.products = cart.products.filter(item =>
            productsNotPurchased.find(p => p.productId.toString() === item.product._id.toString())
        );

        await cart.save();

        return { ticket, productsNotPurchased };
    }
}

export { cartDBManager };
