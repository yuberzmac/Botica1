const db = require('./src/config/db');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('🔧 Verificando columnas en la base de datos...');
    
    const addColumn = async (table, columnDef) => {
      try {
        await db.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
        console.log(`✅ Columna agregada: ${columnDef} en ${table}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ La columna ya existe: ${columnDef.split(' ')[0]} en ${table}`);
        } else {
          throw error;
        }
      }
    };

    await addColumn('productos', 'activo BOOLEAN DEFAULT TRUE');
    await addColumn('ventas', 'vendedor_id INT DEFAULT NULL');
    await addColumn('ventas', 'cliente_id INT DEFAULT NULL');
    
    console.log('🎉 Base de datos lista');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error.message);
    process.exit(1);
  }
}

fixDatabase();
