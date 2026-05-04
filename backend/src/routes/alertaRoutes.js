const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Solo el admin puede ver las alertas críticas
router.get('/', isAdmin, alertaController.getAlertas);

module.exports = router;