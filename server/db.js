const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'Exchenger',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '123456',
});

/**
 * Automatically creates the users table if it does not exist
 * and ensures all required fields are present.
 */
async function initDatabase() {
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create users table with all required fields
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          google_id VARCHAR(255) UNIQUE,
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          avatar VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Ensure additional columns exist for app compatibility
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS uid VARCHAR(50) UNIQUE,
        ADD COLUMN IF NOT EXISTS username VARCHAR(100),
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
        ADD COLUMN IF NOT EXISTS vip_level VARCHAR(20) DEFAULT 'VIP 1',
        ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'unverified',
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email';
      `);

      // Create balances table if not existing
      await client.query(`
        CREATE TABLE IF NOT EXISTS balances (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          total_usdt NUMERIC(18, 4) DEFAULT 0.0000,
          available_usdt NUMERIC(18, 4) DEFAULT 0.0000,
          spot_usdt NUMERIC(18, 4) DEFAULT 0.0000,
          futures_usdt NUMERIC(18, 4) DEFAULT 0.0000,
          staked_usdt NUMERIC(18, 4) DEFAULT 0.0000,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query('COMMIT');
      console.log('PostgreSQL Database connected & users table verified/created successfully!');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Database initialization error:', err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to connect to PostgreSQL server:', err.message);
  }
}

// Execute auto-creation on module load
initDatabase();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
