const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Requiere privilegios de Administrador.' });
  }
};

module.exports = { isAdmin };