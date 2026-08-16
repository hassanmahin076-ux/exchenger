import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldInit = searchParams.get('init') === 'true';

    // Query server time and current database details
    const result = await query(
      'SELECT NOW() as server_time, current_database() as database, version() as version;'
    );

    let tables = [];
    try {
      const tableRes = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      tables = tableRes.rows.map(r => r.table_name);
    } catch (e) {
      // Table query failure non-fatal for basic connection check
    }

    let initResult = null;
    if (shouldInit) {
      initResult = await initializeDatabase();
      const updatedTableRes = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      tables = updatedTableRes.rows.map(r => r.table_name);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to PostgreSQL database!',
      connection: {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        database: result.rows[0]?.database,
        serverTime: result.rows[0]?.server_time,
        version: result.rows[0]?.version,
      },
      tables: tables,
      initialized: initResult ? true : false,
    });
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to PostgreSQL database.',
        error: error.message,
        hint: 'Please verify that PostgreSQL service is running and credentials in .env.local are correct.',
      },
      { status: 500 }
    );
  }
}
