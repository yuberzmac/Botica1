const db = require('../config/db');

exports.getAlertas = async (req, res) => {
  try {
    // Productos con stock menor a 5
    const [bajoStock] = await db.query('SELECT * FROM productos WHERE stock < 5');
    
    // Productos próximos a vencer (en los próximos 30 días)
    const [proximosVencer] = await db.query(`
      SELECT * FROM productos 
      WHERE fecha_vencimiento IS NOT NULL 
      AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    res.json({
      bajoStock,
      proximosVencer
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas', details: error.message });
  }
};