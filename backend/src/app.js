const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/productos', require('./routes/productoRoutes'));
app.use('/ventas', require('./routes/ventaRoutes'));
app.use('/alertas', require('./routes/alertaRoutes'));
app.use('/usuarios', require('./routes/usuarioRoutes'));

// Endpoint de debug para verificar autenticación
app.get('/debug/auth', require('./middlewares/authMiddleware'), (req, res) => {
  res.json({
    message: 'Usuario autenticado correctamente',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Ruta base
app.get('/', (req, res) => {
  res.send('API Backend de Botica Nova Salud Funcionando Correctamente 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});