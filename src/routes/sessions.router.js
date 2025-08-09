import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import config from '../config/config.js';
import UserService from '../services/UserService.js';
import UserDTO from '../dao/DTOs/UserDTO.js';

const router = Router();
const userService = new UserService();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const user = await userService.register(req.body);
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ status: 'success', payload: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// LOGIN con JWT guardado en cookie httpOnly
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await userService.login(email, password);

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Guardar token en cookie httpOnly
    res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hora
      })
      .status(200)
      .json({ status: 'success', message: 'Login successful' });

  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
});

// CURRENT protegido con JWT en cookie
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const safeUser = new UserDTO(req.user);
    res.status(200).json({ status: 'success', user: safeUser });
  }
);

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
  res.status(200).json({ status: 'success', message: 'Logged out' });
});

export default router;
