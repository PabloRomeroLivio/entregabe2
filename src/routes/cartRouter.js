import { Router } from 'express';
import CartService from '../services/cartService.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const cartService = new CartService();

// Todas las rutas requieren usuario autenticado y rol user o admin
router.use(authMiddleware, authorizeRoles('user', 'admin'));

// Middleware para validar que el carrito corresponde al usuario (si no es admin)
function checkCartOwnership(req, res, next) {
  const user = req.user; // seteado por passport o JWT
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
    const result = await cartService.getProductsFromCartByID(req.params.cid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Crear carrito
router.post('/', async (req, res) => {
  try {
    const result = await cartService.createCart();
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Agregar producto al carrito (solo propietario o admin)
router.post('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.addProductByID(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto del carrito (solo propietario o admin)
router.delete('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.deleteProductByID(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar todos los productos del carrito (solo propietario o admin)
router.put('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.updateAllProducts(req.params.cid, req.body.products);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de producto en carrito (solo propietario o admin)
router.put('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Vaciar carrito (solo propietario o admin)
router.delete('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.deleteAllProducts(req.params.cid);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Compra del carrito (solo propietario o admin)
router.post('/:cid/purchase', checkCartOwnership, async (req, res) => {
  try {
    // req.user contiene info del usuario autenticado
    const buyerId = req.user._id;

    const result = await cartService.purchaseCart(req.params.cid, buyerId);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
