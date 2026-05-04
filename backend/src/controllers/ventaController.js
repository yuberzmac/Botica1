const db = require('../config/db');

exports.create = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  const user = req.user;

  let vendedor_id = null;
  let cliente_id = null;

  if (user) {
    if (user.rol === 'admin' || user.rol === 'vendedor') {
      vendedor_id = user.id;
    } else {
      cliente_id = user.id;
    }
  }

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
      'INSERT INTO ventas (producto_id, cantidad, total, vendedor_id, cliente_id) VALUES (?, ?, ?, ?, ?)',
      [producto_id, cantidad, total, vendedor_id, cliente_id]
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
  const user = req.user;

  let vendedor_id = null;
  let cliente_id = null;

  if (user) {
    if (user.rol === 'admin' || user.rol === 'vendedor') {
      vendedor_id = user.id;
    } else {
      cliente_id = user.id;
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar al menos un producto' });
  }

  try {
    let totalCompra = 0;
    const ventasRegistradas = [];

    // 1. Verificar stock para todos los productos primero
    for (const item of items) {
      const [productos] = await db.query('SELECT * FROM productos WHERE id = ? AND activo = true', [item.producto_id]);
      if (productos.length === 0) {
        return res.status(404).json({ message: `Producto ${item.producto_id} no encontrado o inactivo` });
      }

      const producto = productos[0];
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${producto.nombre}` });
      }

      totalCompra += producto.precio * item.cantidad;
    }

    // 2. Registrar todas las ventas
    for (const item of items) {
      const [productos] = await db.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
      const precio = productos[0].precio;
      const total = precio * item.cantidad;

      const [result] = await db.query(
        'INSERT INTO ventas (producto_id, cantidad, total, vendedor_id, cliente_id) VALUES (?, ?, ?, ?, ?)',
        [item.producto_id, item.cantidad, total, vendedor_id, cliente_id]
      );

      ventasRegistradas.push(result.insertId);

      // 3. Descontar stock del producto vendido
      await db.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    res.status(201).json({
      message: 'Compra procesada con éxito',
      total: totalCompra,
      ventas_ids: ventasRegistradas
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const query = `
      SELECT v.id, v.cantidad, v.total, v.fecha, p.nombre as producto_nombre,
             uv.nombre_completo as vendedor_nombre,
             uc.nombre_completo as cliente_nombre
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      LEFT JOIN usuarios uv ON v.vendedor_id = uv.id
      LEFT JOIN usuarios uc ON v.cliente_id = uc.id
      ORDER BY v.fecha DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas', details: error.message });
  }
};