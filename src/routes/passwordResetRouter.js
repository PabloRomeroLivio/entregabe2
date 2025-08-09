import { Router } from 'express';
import UserService from '../services/UserService.js';

const router = Router();
const userService = new UserService();

router.post('/request-reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email es requerido' });

    const token = await userService.generatePasswordResetToken(email);

   
    res.status(200).json({ status: 'success', message: 'Token generado', token });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ status: 'error', message: 'Token y nueva contraseña son requeridos' });

    await userService.resetPassword(token, newPassword);
    res.status(200).json({ status: 'success', message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
