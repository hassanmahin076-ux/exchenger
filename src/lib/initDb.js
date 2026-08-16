import pool from './db';

let isDbInitialized = false;

/**
 * Initializes database tables for "Exchenger" PostgreSQL database
 */
export async function initializeDatabase() {
  if (isDbInitialized) return { success: true, cached: true };

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        vip_level VARCHAR(20) DEFAULT 'VIP 1',
        kyc_status VARCHAR(20) DEFAULT 'unverified',
        google_id VARCHAR(255) UNIQUE,
        avatar_url VARCHAR(500),
        auth_provider VARCHAR(50) DEFAULT 'email',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Balances table
    await client.query(`
      CREATE TABLE IF NOT EXISTS balances (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        total_usdt NUMERIC(18, 4) DEFAULT 0.0000,
        available_usdt NUMERIC(18, 4) DEFAULT 0.0000,
        spot_usdt NUMERIC(18, 4) DEFAULT 0.0000,
        futures_usdt NUMERIC(18, 4) DEFAULT 0.0000,
        staked_usdt NUMERIC(18, 4) DEFAULT 0.0000,
        btc_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        bnb_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        ton_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        trx_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        eth_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        sol_balance NUMERIC(18, 8) DEFAULT 0.00000000,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure token balance columns exist for existing installations
    await client.query(`
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS btc_balance NUMERIC(18, 8) DEFAULT 0.00000000;
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS bnb_balance NUMERIC(18, 8) DEFAULT 0.00000000;
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS ton_balance NUMERIC(18, 8) DEFAULT 0.00000000;
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS trx_balance NUMERIC(18, 8) DEFAULT 0.00000000;
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS eth_balance NUMERIC(18, 8) DEFAULT 0.00000000;
      ALTER TABLE balances ADD COLUMN IF NOT EXISTS sol_balance NUMERIC(18, 8) DEFAULT 0.00000000;
    `);

    // Create KYC Verifications table
    await client.query(`
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

    // Create Deposits table
    await client.query(`
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

    // Create Withdrawals table
    await client.query(`
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

    // Create Balance Transactions table
    await client.query(`
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

    // Create Markets table
    await client.query(`
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

    // Create User Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'reward',
        amount NUMERIC(18, 4) DEFAULT 0.00,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Red Packets (Crypto Box) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS red_packets (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        amount_per_user NUMERIC(18, 4) NOT NULL,
        max_claims INT DEFAULT 100,
        claimed_count INT DEFAULT 0,
        title VARCHAR(255) DEFAULT 'Red Packet Gift',
        created_by VARCHAR(100) DEFAULT 'Admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Red Packet Claims table
    await client.query(`
      CREATE TABLE IF NOT EXISTS red_packet_claims (
        id SERIAL PRIMARY KEY,
        red_packet_id INT REFERENCES red_packets(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(50) NOT NULL,
        amount NUMERIC(18, 4) NOT NULL,
        claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(red_packet_id, user_id)
      );
    `);

    // Create Site Analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_analytics (
        id SERIAL PRIMARY KEY,
        total_visitors INT DEFAULT 12840,
        online_users INT DEFAULT 18,
        total_page_views INT DEFAULT 45210,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Support Tickets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id SERIAL PRIMARY KEY,
        ticket_code VARCHAR(50) UNIQUE NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        subject VARCHAR(255) DEFAULT 'General Support',
        message TEXT NOT NULL,
        reply TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert initial row for site analytics if empty
    await client.query(`
      INSERT INTO site_analytics (id, total_visitors, online_users, total_page_views)
      VALUES (1, 12840, 18, 45210)
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query('COMMIT');
    isDbInitialized = true;
    return { success: true, message: 'Database tables initialized successfully' };
  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (_) {}
    }
    // If sequence or table already exists due to concurrent request, mark initialized
    if (error.code === '23505' || error.code === '42P07') {
      isDbInitialized = true;
      return { success: true, cached: true };
    }
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}
