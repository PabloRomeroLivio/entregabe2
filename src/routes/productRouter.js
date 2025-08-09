import { Router } from 'express';
import ProductService from '../services/ProductService.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const productService = new ProductService();


router.get('/', async (req, res) => {
  try {
    const products = await productService.getAll(req.query);
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productService.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});


router.use(authMiddleware, authorizeRoles('admin'));

router.post('/', async (req, res) => {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productService.update(req.params.pid, req.body);
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productService.delete(req.params.pid);
    res.json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
