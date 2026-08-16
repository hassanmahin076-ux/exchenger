const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'Exchenger',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '123456'
});

async function run() {
  try {
    const res = await pool.query('SELECT NOW();');
    console.log('Connected to database:', process.env.PGDATABASE || 'Exchenger', 'at:', res.rows[0].now);

    await pool.query('BEGIN');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        vip_level VARCHAR(20) DEFAULT 'VIP 1',
        kyc_status VARCHAR(20) DEFAULT 'unverified',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS kyc_verifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(150),
        id_number VARCHAR(100),
        country VARCHAR(100),
        document_type VARCHAR(50),
        id_front_path VARCHAR(255),
        id_back_path VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS deposits (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        asset VARCHAR(20) NOT NULL,
        amount NUMERIC(18, 4) NOT NULL,
        tx_hash VARCHAR(255),
        deposit_address VARCHAR(255),
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        asset VARCHAR(20) NOT NULL DEFAULT 'USDT',
        amount NUMERIC(18, 4) NOT NULL,
        destination_address VARCHAR(255) NOT NULL,
        chain VARCHAR(50) DEFAULT 'BEP20',
        fee NUMERIC(18, 4) DEFAULT 0.0000,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS balance_transactions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        admin_uid VARCHAR(50),
        type VARCHAR(50) NOT NULL,
        asset VARCHAR(20) DEFAULT 'USDT',
        amount NUMERIC(18, 4) NOT NULL,
        balance_before NUMERIC(18, 4),
        balance_after NUMERIC(18, 4),
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS markets (
        id VARCHAR(50) PRIMARY KEY,
        symbol VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(18, 4) NOT NULL,
        change_24h NUMERIC(8, 2) DEFAULT 0.00,
        high_24h NUMERIC(18, 4),
        low_24h NUMERIC(18, 4),
        volume VARCHAR(50),
        category VARCHAR(50),
        is_hot BOOLEAN DEFAULT false,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query('COMMIT');
    console.log('Tables created successfully!');

    const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
    console.log('Tables present in database:', tablesRes.rows.map(r => r.table_name));
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error('Migration error:', e.message);
  } finally {
    pool.end();
  }
}

run();
