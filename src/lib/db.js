import { Pool } from 'pg';

let pgPoolInstance = null;

function getPgPool() {
  if (!pgPoolInstance) {
    let poolConfig;
    if (process.env.DATABASE_URL) {
      poolConfig = {
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      };
    } else {
      let rawHost = process.env.PGHOST || '127.0.0.1';
      if (rawHost === 'localhost') rawHost = '127.0.0.1';
      poolConfig = {
        host: rawHost,
        port: parseInt(process.env.PGPORT || '5432', 10),
        database: process.env.PGDATABASE || 'pokyvakh_exchenger',
        user: process.env.PGUSER || 'pokyvakh_user',
        password: process.env.PGPASSWORD || '4rT_%6GkXFw&,nt',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      };
    }
    pgPoolInstance = new Pool(poolConfig);
  }
  return pgPoolInstance;
}

function normalizeResult(res) {
  if (!res) return { rows: [], rowCount: 0, fields: [] };
  const rows = res.rows || [];
  const rowCount = res.rowCount !== undefined ? res.rowCount : (res.affectedRows !== undefined ? res.affectedRows : rows.length);
  const fields = res.fields || [];
  return { rows, rowCount, fields };
}

/**
 * Execute SQL query against PostgreSQL database
 * @param {string} text - SQL Query string
 * @param {Array} [params] - Query parameter array
 */
export async function query(text, params) {
  const pool = getPgPool();
  const res = await pool.query(text, params);
  return normalizeResult(res);
}

const dbPool = {
  async query(text, params) {
    return query(text, params);
  },
  async connect() {
    const pool = getPgPool();
    const client = await pool.connect();
    return client;
  }
};

export default dbPool;
