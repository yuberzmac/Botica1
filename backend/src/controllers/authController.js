const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable');
}

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    const query = `
      SELECT u.*, r.nombre as rol 
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      WHERE u.correo = ?
    `;
    let [users] = await db.query(query, [email]);
    let user;

    if (users.length === 0) {
      // User doesn't exist, create it with a random password and rol_id 3 (cliente)
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre_completo, correo, password, rol_id) VALUES (?, ?, ?, ?)',
        [name, email, randomPassword, 3]
      );
      
      const [newUsers] = await db.query(query, [email]);
      user = newUsers[0];
    } else {
      user = users[0];
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre_completo, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre_completo, correo: user.correo, rol: user.rol } });

  } catch (error) {
    res.status(500).json({ error: 'Error en la autenticación con Google', details: error.message });
  }
};

exports.register = async (req, res) => {
  const { nombre_completo, correo, telefono, password } = req.body;
  try {
    // Verificar si el correo ya existe
    const [existing] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // rol_id 3 es 'cliente' por defecto
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre_completo, correo, telefono, hashedPassword, 3]
    );
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const query = `
      SELECT u.*, r.nombre as rol 
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      WHERE u.correo = ?
    `;
    const [users] = await db.query(query, [correo]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre_completo, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre_completo, correo: user.correo, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login', details: error.message });
  }
};