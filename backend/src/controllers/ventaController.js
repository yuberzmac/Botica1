const db = require('../config/db');

exports.create = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  
  try {
    // 1. Obtener el producto para verificar stock y precio
    const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [producto_id]);
    if (productos.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const producto = productos[0];
    
    // 2. Verificar stock suficiente
    if (producto.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente para la venta' });
    }
    
    const total = producto.precio * cantidad;
    
    // 3. Registrar la venta
    const [result] = await db.query(
      'INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)',
      [producto_id, cantidad, total]
    );
    
    // 4. Descontar el stock automáticamente
    await db.query(
      'UPDATE productos SET stock = stock - ? WHERE id = ?',
      [cantidad, producto_id]
    );
    
    res.status(201).json({ message: 'Venta registrada con éxito', total, venta_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar venta', details: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const query = `
      SELECT v.id, v.cantidad, v.total, v.fecha, p.nombre as producto_nombre
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      ORDER BY v.fecha DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas', details: error.message });
  }
};