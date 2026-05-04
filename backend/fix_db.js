const db = require('./src/config/db');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('🔧 Intentando agregar columna activo a la tabla productos...');
    
    // Agregar columna activo si no existe
    await db.query(`
      ALTER TABLE productos 
      ADD COLUMN activo BOOLEAN DEFAULT TRUE
    `);
    
    console.log('✅ Columna activo agregada exitosamente');
    process.exit(0);
  } catch (error) {
    // Si la columna ya existe, ese error es normal
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ La columna activo ya existe en la tabla productos');
      process.exit(0);
    } else {
      console.error('❌ Error al actualizar la base de datos:', error.message);
      console.log('📋 Código de error:', error.code);
      process.exit(1);
    }
  }
}

fixDatabase();
