import { Pool } from 'pg';

let pgPoolInstance = null;

function getPgPool() {
  if (!pgPoolInstance) {
    const poolConfig = {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      database: process.env.PGDATABASE || 'Exchenger',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '123456',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
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
