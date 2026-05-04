const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { canSellProducts, canBuyProducts } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Vender productos individuales - admin y vendedores
router.post('/', canSellProducts, ventaController.create);

// Comprar múltiples productos (carrito) - todos pueden comprar
router.post('/comprar', canBuyProducts, ventaController.createMultiple);

// Ver ventas - todos pueden ver sus propias ventas (por ahora todos ven todas)
router.get('/', canBuyProducts, ventaController.getAll);

module.exports = router;