const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'Exchenger',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '123456'
});

async function runMigration() {
  try {
    console.log('Connecting to database:', process.env.PGDATABASE || 'Exchenger');
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email';
    `);

    console.log('Successfully added Google OAuth columns to users table!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
