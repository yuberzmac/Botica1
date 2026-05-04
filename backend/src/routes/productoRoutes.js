const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware); // Todas las rutas de productos requieren autenticación

router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);

// Solo el admin puede modificar el inventario
router.post('/', isAdmin, productoController.create);
router.put('/:id', isAdmin, productoController.update);
router.delete('/:id', isAdmin, productoController.delete);

module.exports = router;