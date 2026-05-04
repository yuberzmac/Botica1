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

// Nueva función para procesar compras múltiples (carrito)
exports.createMultiple = async (req, res) => {
  const { items } = req.body; // items es un array de { producto_id, cantidad }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar al menos un producto' });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let totalCompra = 0;
    const ventasRegistradas = [];

    // 1. Verificar stock para todos los productos primero
    for (const item of items) {
      const [productos] = await connection.query('SELECT * FROM productos WHERE id = ? AND activo = true', [item.producto_id]);
      if (productos.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `Producto ${item.producto_id} no encontrado o inactivo` });
      }

      const producto = productos[0];
      if (producto.stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({ message: `Stock insuficiente para ${producto.nombre}` });
      }

      totalCompra += producto.precio * item.cantidad;
    }

    // 2. Registrar todas las ventas
    for (const item of items) {
      const [productos] = await connection.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
      const precio = productos[0].precio;
      const total = precio * item.cantidad;

      const [result] = await connection.query(
        'INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)',
        [item.producto_id, item.cantidad, total]
      );

      ventasRegistradas.push(result.insertId);
    }

    // 3. Descontar stock para todos los productos
    for (const item of items) {
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();
    res.status(201).json({
      message: 'Compra procesada con éxito',
      total: totalCompra,
      ventas_ids: ventasRegistradas
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
  } finally {
    connection.release();
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