import { productDBManager } from './dao/productDBManager.js';
const ProductService = new productDBManager();

export default (io) => {
  io.on('connection', async (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id}`);

    // Al conectarse, enviar todos los productos actuales
    try {
      const products = await ProductService.getAllProducts({});
      socket.emit('publishProducts', products?.docs || []);
    } catch (error) {
      console.error('❌ Error al obtener productos iniciales:', error.message);
      socket.emit('statusError', 'Error al obtener productos iniciales');
    }

    // Escuchar evento para crear producto
    socket.on('createProduct', async (data) => {
      try {
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products?.docs || []); // Enviar a todos los clientes
      } catch (error) {
        console.error('❌ Error al crear producto:', error.message);
        socket.emit('statusError', error.message);
      }
    });

    // Escuchar evento para eliminar producto por ID
    socket.on('deleteProduct', async ({ pid }) => {
      try {
        await ProductService.deleteProduct(pid);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products?.docs || []); // Enviar a todos los clientes
      } catch (error) {
        console.error('❌ Error al eliminar producto:', error.message);
        socket.emit('statusError', error.message);
      }
    });

    // Evento cuando un cliente se desconecta
    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};
