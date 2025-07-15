import { Router } from 'express';
import passport from 'passport';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

const requireAuth = passport.authenticate('jwt', { session: false });


router.get('/', (req, res) => {
  res.redirect('/products');
});


router.get('/products', requireAuth, async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  console.log('Productos recibidos:', products.docs.length);

  res.render('index', {
    title: 'Productos',
    style: 'index.css',
    products: JSON.parse(JSON.stringify(products.docs)),
    prevLink: {
      exist: products.prevLink ? true : false,
      link: products.prevLink
    },
    nextLink: {
      exist: products.nextLink ? true : false,
      link: products.nextLink
    }
  });
});

router.get('/realtimeproducts', requireAuth, async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);

  res.render('realTimeProducts', {
    title: 'Productos en tiempo real',
    style: 'index.css',
    products: JSON.parse(JSON.stringify(products.docs))
  });
});


router.get('/cart/:cid', requireAuth, async (req, res) => {
  const response = await CartService.getProductsFromCartByID(req.params.cid);

  if (response.status === 'error') {
    return res.render('notFound', {
      title: 'No encontrado',
      style: 'index.css'
    });
  }

  res.render('cart', {
    title: 'Carrito',
    style: 'index.css',
    products: JSON.parse(JSON.stringify(response.products))
  });
});

export default router;
