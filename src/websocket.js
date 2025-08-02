import { productDBManager } from './dao/productDBManager.js';
const ProductService = new productDBManager();

export default (io) => {
  io.on('connection', async (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id}`);

    // Enviar productos actuales al conectar
    try {
      const products = await ProductService.getAllProducts({});
      socket.emit('publishProducts', products.docs);
    } catch (error) {
      console.error('❌ Error al obtener productos iniciales:', error);
      socket.emit('statusError', 'Error al obtener productos iniciales');
    }

    // Crear producto
    socket.on('createProduct', async (data) => {
      try {
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products.docs); // Emitir a todos los clientes
      } catch (error) {
        console.error('❌ Error al crear producto:', error.message);
        socket.emit('statusError', error.message);
      }
    });

    // Eliminar producto
    socket.on('deleteProduct', async ({ pid }) => {
      try {
        await ProductService.deleteProduct(pid);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products.docs); // Emitir a todos los clientes
      } catch (error) {
        console.error('❌ Error al eliminar producto:', error.message);
        socket.emit('statusError', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};
