const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function runSQL() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

    for (let statement of statements) {
      await db.query(statement);
    }
    console.log('✅ Base de datos actualizada con el nuevo esquema.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error);
    process.exit(1);
  }
}

runSQL();