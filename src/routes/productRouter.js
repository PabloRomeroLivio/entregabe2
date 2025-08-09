import { Router } from 'express';
import { ProductRepository } from '../dao/repositories/productRepository.js'; // <-- Importamos el repository
import { uploader } from '../utils/multerUtil.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const router = Router();
const productRepo = new ProductRepository();  // <-- Instanciamos el repository

// 🔓 Rutas públicas

router.get('/', async (req, res) => {
  try {
    const result = await productRepo.getAllProducts(req.query);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const result = await productRepo.getProductByID(req.params.pid);
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

      const result = await productRepo.createProduct(req.body);
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

      const result = await productRepo.updateProduct(req.params.pid, req.body);
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
      const result = await productRepo.deleteProduct(req.params.pid);
      res.send({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
);

export default router;
