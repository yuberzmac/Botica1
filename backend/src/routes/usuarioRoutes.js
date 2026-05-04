const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const { canManageUsers } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Solo admin puede gestionar usuarios
router.get('/', canManageUsers, usuarioController.getAll);
router.get('/:id', canManageUsers, usuarioController.getById);
router.put('/:id', canManageUsers, usuarioController.update);
router.delete('/:id', canManageUsers, usuarioController.delete);

module.exports = router;