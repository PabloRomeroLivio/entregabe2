import { Router } from 'express';
import { cartDBManager } from '../dao/cartDBManager.js';
import { productDBManager } from '../dao/productDBManager.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// Todas las rutas requieren usuario autenticado y rol user o admin
router.use(authMiddleware, authorizeRoles('user', 'admin'));

// Middleware para validar que el carrito corresponde al usuario (si no es admin)
function checkCartOwnership(req, res, next) {
  const user = req.user; // seteado por passport
  const cartId = req.params.cid;

  if (user.role === 'admin') {
    return next(); // admin puede acceder a cualquier carrito
  }

  // si no es admin, validar que el carrito pertenece al usuario
  if (user.cart.toString() !== cartId) {
    return res.status(403).json({ status: 'error', message: 'Forbidden - You do not own this cart' });
  }

  next();
}

// Obtener productos del carrito (solo propietario o admin)
router.get('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.getProductsFromCartByID(req.params.cid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Crear carrito (usualmente puede ser admin o se crea automáticamente con registro)
// Si se quiere restringir, aplicar authorizeRoles('admin') o dejar abierto
router.post('/', async (req, res) => {
  try {
    const result = await CartService.createCart();
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Agregar producto al carrito (solo propietario o admin)
router.post('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.addProductByID(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto del carrito (solo propietario o admin)
router.delete('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.deleteProductByID(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar todos los productos del carrito (solo propietario o admin)
router.put('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.updateAllProducts(req.params.cid, req.body.products);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de producto en carrito (solo propietario o admin)
router.put('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Vaciar carrito (solo propietario o admin)
router.delete('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await CartService.deleteAllProducts(req.params.cid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;

