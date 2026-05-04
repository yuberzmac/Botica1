const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.nombre_completo, u.correo, u.telefono, r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.nombre_completo
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.nombre_completo, u.correo, u.telefono, r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `;
    const [rows] = await db.query(query, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

exports.update = async (req, res) => {
  const { nombre_completo, correo, telefono, rol } = req.body;
  try {
    // Obtener el rol_id del nombre del rol
    const [roleRows] = await db.query('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (roleRows.length === 0) return res.status(400).json({ message: 'Rol no válido' });

    const rol_id = roleRows[0].id;

    const [result] = await db.query(
      'UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ?, rol_id = ? WHERE id = ?',
      [nombre_completo, correo, telefono, rol_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};