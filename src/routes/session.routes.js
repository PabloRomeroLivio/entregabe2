
import { authMiddleware } from '../middlewares/auth.js';

router.get('/current', authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});