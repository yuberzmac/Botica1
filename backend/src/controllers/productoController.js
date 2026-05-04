const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

exports.create = async (req, res) => {
  const { nombre, stock, precio, fecha_vencimiento } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, stock, precio, fecha_vencimiento) VALUES (?, ?, ?, ?)',
      [nombre, stock, precio, fecha_vencimiento]
    );
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

exports.update = async (req, res) => {
  const { nombre, stock, precio, fecha_vencimiento } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, stock = ?, precio = ?, fecha_vencimiento = ? WHERE id = ?',
      [nombre, stock, precio, fecha_vencimiento, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
  }
};