import { Router } from 'express';
import CartService from '../services/cartService.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const cartService = new CartService();


router.use(authMiddleware, authorizeRoles('user', 'admin'));


function checkCartOwnership(req, res, next) {
  const user = req.user; 
  const cartId = req.params.cid;

  if (user.role === 'admin') {
    return next();
  }


  if (user.cart.toString() !== cartId) {
    return res.status(403).json({ status: 'error', message: 'Forbidden - You do not own this cart' });
  }

  next();
}


router.get('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.getById(req.params.cid);  
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const result = await cartService.create(); 
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.post('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.addProduct(req.params.cid, req.params.pid); 
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.delete('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.deleteProduct(req.params.cid, req.params.pid); 
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.put('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const products = req.body.products; 
    const result = await cartService.updateProducts(req.params.cid, products);
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.put('/:cid/product/:pid', checkCartOwnership, async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const result = await cartService.updateProductQuantity(req.params.cid, req.params.pid, quantity); 
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.delete('/:cid', checkCartOwnership, async (req, res) => {
  try {
    const result = await cartService.clearCart(req.params.cid); 
    res.json({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.post('/:cid/purchase', checkCartOwnership, async (req, res) => {
  try {
    const buyerId = req.user._id; 
    const result = await cartService.purchaseCart(req.params.cid, buyerId); 
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
