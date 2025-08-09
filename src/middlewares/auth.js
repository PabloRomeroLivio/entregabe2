import passport from 'passport';


export const authMiddleware = passport.authenticate('jwt', { session: false });

/**
 * 
 * 
 * @param  {...string} allowedRoles - 
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - Token inválido o ausente' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden - No tienes permisos suficientes' });
    }

    next();
  };
};

