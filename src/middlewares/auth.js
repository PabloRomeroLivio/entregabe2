import passport from 'passport';

/**
 * Middleware de autenticación.
 * Verifica que el usuario tenga un JWT válido.
 * Se basa en la estrategia 'jwt' configurada en passport.config.js
 */
export const authMiddleware = passport.authenticate('jwt', { session: false });

/**
 * Middleware de autorización por roles.
 * Permite acceso solo a usuarios con ciertos roles (admin, user, premium, etc.).
 * @param  {...string} allowedRoles - Lista de roles autorizados
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

