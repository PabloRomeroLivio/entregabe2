import { productDBManager } from './dao/productDBManager.js';
const ProductService = new productDBManager();

export default (io) => {
  io.on('connection', async (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id}`);

 
    try {
      const products = await ProductService.getAllProducts({});
      socket.emit('publishProducts', products?.docs || []);
    } catch (error) {
      console.error('❌ Error al obtener productos iniciales:', error.message);
      socket.emit('statusError', 'Error al obtener productos iniciales');
    }

   
    socket.on('createProduct', async (data) => {
      try {
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products?.docs || []); 
      } catch (error) {
        console.error('❌ Error al crear producto:', error.message);
        socket.emit('statusError', error.message);
      }
    });


    socket.on('deleteProduct', async ({ pid }) => {
      try {
        await ProductService.deleteProduct(pid);
        const products = await ProductService.getAllProducts({});
        io.emit('publishProducts', products?.docs || []); 
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
