const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    console.warn('⚠️ Sin token en la solicitud');
    return res.status(401).json({
      message: 'Acceso denegado, no hay token.',
      hint: 'Incluye el header Authorization: Bearer <token>'
    });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    console.log('✅ Token validado para usuario:', {
      id: decoded.id,
      nombre: decoded.nombre_completo,
      rol: decoded.rol
    });
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Error validando token:', error.message);
    res.status(401).json({
      message: 'Token no válido',
      error: error.message,
      hint: 'El token ha expirado o es inválido. Por favor, inicia sesión nuevamente.'
    });
  }
};

module.exports = authMiddleware;