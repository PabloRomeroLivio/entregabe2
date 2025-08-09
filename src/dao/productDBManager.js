import productModel from "./models/productModel.js";

class productDBManager {
    async getAllProducts(params) {
        try {
            const paginate = {
                page: params.page ? parseInt(params.page) : 1,
                limit: params.limit ? parseInt(params.limit) : 10,
            };

            if (params.sort && (params.sort === 'asc' || params.sort === 'desc')) {
                paginate.sort = { price: params.sort };
            }

            const products = await productModel.paginate({}, paginate);

            products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : null;
            products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : null;

            if (products.prevLink && paginate.limit !== 10) products.prevLink += `&limit=${paginate.limit}`;
            if (products.nextLink && paginate.limit !== 10) products.nextLink += `&limit=${paginate.limit}`;

            if (products.prevLink && paginate.sort) products.prevLink += `&sort=${params.sort}`;
            if (products.nextLink && paginate.sort) products.nextLink += `&sort=${params.sort}`;

            return products;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductByID(pid) {
        try {
            const product = await productModel.findById(pid);
            if (!product) throw new Error(`El producto ${pid} no existe!`);
            return product;
        } catch (error) {
            throw new Error(`Error al buscar producto: ${error.message}`);
        }
    }

    async createProduct(product) {
        try {
            const { title, description, code, price, stock, category, thumbnails } = product;

            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error('Faltan datos obligatorios para crear el producto');
            }

            const newProduct = await productModel.create({ title, description, code, price, stock, category, thumbnails });
            return newProduct;
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await productModel.updateOne({ _id: pid }, productUpdate);
            if (result.matchedCount === 0) throw new Error(`Producto ${pid} no encontrado para actualizar`);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await productModel.deleteOne({ _id: pid });
            if (result.deletedCount === 0) throw new Error(`Producto ${pid} no encontrado para eliminar`);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

export { productDBManager };
