import { ProductRepository } from '../dao/repositories/productRepository.js';
import ProductDTO from '../dao/DTOs/ProductDTO.js';

export default class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAll(params) {
    const products = await this.productRepository.getAll(params);
    return products.map(product => new ProductDTO(product));
  }

  async getById(id) {
    const product = await this.productRepository.getById(id);
    if (!product) throw new Error('Producto no encontrado');
    return new ProductDTO(product);
  }

  async create(productData) {
    const newProduct = await this.productRepository.create(productData);
    return new ProductDTO(newProduct);
  }

  async update(id, productData) {
    const updatedProduct = await this.productRepository.update(id, productData);
    if (!updatedProduct) throw new Error('Producto no encontrado para actualizar');
    return new ProductDTO(updatedProduct);
  }

  async delete(id) {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) throw new Error('Producto no encontrado para eliminar');
    return true;
  }
}
