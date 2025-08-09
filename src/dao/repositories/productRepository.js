import { productDBManager } from "../productDBManager.js";

class ProductRepository {
    constructor() {
        this.dao = new productDBManager();
    }

    async getAll(params) {
        try {
            return await this.dao.getAllProducts(params);
        } catch (error) {
            throw new Error(`Repository: Error obteniendo productos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await this.dao.getProductByID(id);
        } catch (error) {
            throw new Error(`Repository: Error buscando producto por ID: ${error.message}`);
        }
    }

    async create(productData) {
        try {
            return await this.dao.createProduct(productData);
        } catch (error) {
            throw new Error(`Repository: Error creando producto: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await this.dao.updateProduct(id, productData);
        } catch (error) {
            throw new Error(`Repository: Error actualizando producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            throw new Error(`Repository: Error eliminando producto: ${error.message}`);
        }
    }
}

export { ProductRepository };
