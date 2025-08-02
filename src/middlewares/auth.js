import passport from 'passport';

export const authMiddleware = passport.authenticate('jwt', { session: false });

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - No user' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden - You do not have permission' });
    }

    next();
  };
};
