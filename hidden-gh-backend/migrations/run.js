const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runMigrations() {
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log('All migrations complete.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
