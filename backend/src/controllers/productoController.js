const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    let query = 'SELECT * FROM productos';
    let params = [];

    // Si no es admin, solo mostrar productos activos
    if (req.user.rol !== 'admin') {
      query += ' WHERE activo = ?';
      params.push(true);
    }

    query += ' ORDER BY nombre';
    const [rows] = await db.query(query, params);
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
  try {
    console.log('📝 Intentando crear producto:', req.body);
    console.log('👤 Usuario:', req.user);

    const { nombre, stock, precio, fecha_vencimiento, activo = true } = req.body;

    // Validación de datos requeridos
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        message: 'El nombre del producto es obligatorio',
        received: { nombre, stock, precio }
      });
    }

    // Convertir a números
    const stockNum = parseInt(stock);
    const precioNum = parseFloat(precio);

    // Validación de tipos
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        message: 'El stock debe ser un número positivo',
        received: stock,
        converted: stockNum
      });
    }

    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({
        message: 'El precio debe ser un número positivo mayor a 0',
        received: precio,
        converted: precioNum
      });
    }

    // Validar fecha si se proporciona
    let fechaVencimientoFinal = null;
    if (fecha_vencimiento && fecha_vencimiento.trim() !== '') {
      const fecha = new Date(fecha_vencimiento);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({
          message: 'La fecha de vencimiento no es válida',
          received: fecha_vencimiento
        });
      }
      fechaVencimientoFinal = fecha_vencimiento;
    }

    console.log('✅ Datos validados:', {
      nombre,
      stock: stockNum,
      precio: precioNum,
      fecha_vencimiento: fechaVencimientoFinal,
      activo
    });

    const [result] = await db.query(
      'INSERT INTO productos (nombre, stock, precio, fecha_vencimiento, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), stockNum, precioNum, fechaVencimientoFinal, activo]
    );

    console.log('✅ Producto creado exitosamente con ID:', result.insertId);
    res.status(201).json({
      message: 'Producto creado exitosamente',
      id: result.insertId,
      producto: { nombre, stock: stockNum, precio: precioNum, fecha_vencimiento: fechaVencimientoFinal, activo }
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({
      error: 'Error al crear producto en la base de datos',
      message: error.message,
      sqlError: error.sqlMessage || error.code || 'Sin detalles SQL disponibles',
      hint: 'Verifica que todos los campos sean válidos y que la conexión a BD esté activa'
    });
  }
};

exports.update = async (req, res) => {
  const { nombre, stock, precio, fecha_vencimiento, activo } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, stock = ?, precio = ?, fecha_vencimiento = ?, activo = ? WHERE id = ?',
      [nombre, stock, precio, fecha_vencimiento, activo, req.params.id]
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