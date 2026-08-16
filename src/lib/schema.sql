-- Database Schema for "Exchenger" PostgreSQL Database

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  vip_level VARCHAR(20) DEFAULT 'VIP 1',
  kyc_status VARCHAR(20) DEFAULT 'unverified',
  status VARCHAR(20) DEFAULT 'active',
  google_id VARCHAR(255) UNIQUE,
  avatar_url VARCHAR(500),
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Balances Table
CREATE TABLE IF NOT EXISTS balances (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  total_usdt NUMERIC(18, 4) DEFAULT 0.0000,
  available_usdt NUMERIC(18, 4) DEFAULT 0.0000,
  spot_usdt NUMERIC(18, 4) DEFAULT 0.0000,
  futures_usdt NUMERIC(18, 4) DEFAULT 0.0000,
  staked_usdt NUMERIC(18, 4) DEFAULT 0.0000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KYC Verification Requests
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150),
  id_number VARCHAR(100),
  country VARCHAR(100),
  document_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Deposits Table
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

-- Withdrawals Table
CREATE TABLE IF NOT EXISTS withdrawals (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  asset VARCHAR(20) NOT NULL,
  amount NUMERIC(18, 4) NOT NULL,
  destination_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Markets Table
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
