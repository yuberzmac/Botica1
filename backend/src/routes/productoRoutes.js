const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { canViewProducts, canManageProducts } = require('../middlewares/roleMiddleware');

router.use(authMiddleware); // Todas las rutas requieren autenticación

// Ver productos - todos los roles autenticados
router.get('/', canViewProducts, productoController.getAll);
router.get('/:id', canViewProducts, productoController.getById);

// Gestionar productos - solo admin
router.post('/', canManageProducts, productoController.create);
router.put('/:id', canManageProducts, productoController.update);
router.delete('/:id', canManageProducts, productoController.delete);

module.exports = router;