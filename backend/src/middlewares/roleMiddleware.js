const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Requiere privilegios de Administrador.' });
  }
};

const canViewProducts = (req, res, next) => {
  if (req.user && (req.user.rol === 'admin' || req.user.rol === 'vendedor' || req.user.rol === 'cliente')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado.' });
  }
};

const canManageProducts = (req, res, next) => {
  console.log('Verificando permisos para gestionar productos:', {
    user: req.user,
    rol: req.user?.rol,
    path: req.path,
    method: req.method
  });

  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    console.log('Acceso denegado: usuario no es admin');
    res.status(403).json({
      message: 'Acceso denegado. Solo administradores pueden gestionar productos.',
      userRol: req.user?.rol,
      requiredRol: 'admin'
    });
  }
};

const canSellProducts = (req, res, next) => {
  if (req.user && (req.user.rol === 'admin' || req.user.rol === 'vendedor')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores y vendedores pueden vender productos.' });
  }
};

const canBuyProducts = (req, res, next) => {
  if (req.user && (req.user.rol === 'admin' || req.user.rol === 'vendedor' || req.user.rol === 'cliente')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado.' });
  }
};

const canManageUsers = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden gestionar usuarios.' });
  }
};

const canViewAlerts = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden ver alertas críticas.' });
  }
};

module.exports = {
  isAdmin,
  canViewProducts,
  canManageProducts,
  canSellProducts,
  canBuyProducts,
  canManageUsers,
  canViewAlerts
};