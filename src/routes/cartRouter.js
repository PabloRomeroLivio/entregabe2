import { Router } from 'express';
import passport from 'passport';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/:cid', async (req, res) => {
  try {
    const result = await CartService.getProductsFromCartByID(req.params.cid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const result = await CartService.createCart();
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/:cid/product/:pid', requireAuth, async (req, res) => {
  try {
    const result = await CartService.addProductByID(req.params.cid, req.params.pid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/:cid/product/:pid', requireAuth, async (req, res) => {
  try {
    const result = await CartService.deleteProductByID(req.params.cid, req.params.pid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/:cid', requireAuth, async (req, res) => {
  try {
    const result = await CartService.updateAllProducts(req.params.cid, req.body.products);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/:cid/product/:pid', requireAuth, async (req, res) => {
  try {
    const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/:cid', requireAuth, async (req, res) => {
  try {
    const result = await CartService.deleteAllProducts(req.params.cid);
    res.send({
      status: 'success',
      payload: result
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
