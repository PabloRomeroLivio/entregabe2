import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../dao/models/user.model.js';
import { cartModel } from '../dao/models/cartModel.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import config from '../config/config.js';
import passport from 'passport';
import UserDTO from '../dao/DTOs/UserDTO.js';

const router = Router();

// REGISTRO CON CREACIÓN DE CARRITO
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Crear carrito vacío
    const newCart = await cartModel.create({ products: [] });

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: email === config.ADMIN_EMAIL ? 'admin' : 'user', // rol admin si email es admin
    };

    const result = await userModel.create(newUser);
    const { password: _, ...userWithoutPassword } = result.toObject();

    res.status(201).json({ status: 'success', payload: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// LOGIN - genera JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });

    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Generar token con id y role
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// USER ACTUAL - protegido con JWT y Passport
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const safeUser = new UserDTO(req.user);
    res.json({ status: 'success', user: safeUser });
  }
);

// LOGOUT - simple endpoint para cliente, no destruye token
router.post('/logout', (req, res) => {
  res.json({ status: 'success', message: 'Logged out' });
});

export default router;
