import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/crypto.js';
import config from '../config/config.js';
import passport from 'passport';

const router = Router();


router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) return res.status(400).json({ status: 'error', message: 'User already exists' });

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    };

    const result = await userModel.create(newUser);
    const { password: _, ...userWithoutPassword } = result.toObject();

    res.status(201).json({ status: 'success', payload: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

  
    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ status: 'success', user: req.user });
});

export default router;
