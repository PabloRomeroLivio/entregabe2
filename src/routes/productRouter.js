import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { uploader } from '../utils/multerUtil.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const ProductService = new productDBManager();

// 🔓 Rutas públicas

router.get('/', async (req, res) => {
  try {
    const result = await ProductService.getAllProducts(req.query);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const result = await ProductService.getProductByID(req.params.pid);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message });
  }
});

// 🔐 Rutas protegidas SOLO para admin

router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    try {
      if (req.files) {
        req.body.thumbnails = req.files.map(file => file.path);
      }

      const result = await ProductService.createProduct(req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

router.put(
  '/:pid',
  authMiddleware,
  authorizeRoles('admin'),
  uploader.array('thumbnails', 3),
  async (req, res) => {
    try {
      if (req.files) {
        req.body.thumbnails = req.files.map(file => file.path);
      }

      const result = await ProductService.updateProduct(req.params.pid, req.body);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

router.delete(
  '/:pid',
  authMiddleware,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const result = await ProductService.deleteProduct(req.params.pid);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

export default router;
