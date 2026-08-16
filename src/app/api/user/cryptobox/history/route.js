import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const userUid = searchParams.get('uid');
    const userEmail = searchParams.get('email');

    if (!userUid && !userEmail) {
      return NextResponse.json(
        { success: false, error: 'User UID or email required.' },
        { status: 400 }
      );
    }

    const userRes = await pool.query(
      `SELECT id FROM users 
       WHERE (uid IS NOT NULL AND uid = $1)
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2));`,
      [userUid || 'NO_UID', (userEmail || 'NO_EMAIL').toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: true, history: [] });
    }

    const userId = userRes.rows[0].id;

    const historyRes = await pool.query(
      `SELECT c.id, c.code, c.amount, c.claimed_at, 
              COALESCE(p.title, 'Red Packet Gift') AS title,
              COALESCE(p.created_by, 'Admin') AS created_by
       FROM red_packet_claims c
       LEFT JOIN red_packets p ON p.id = c.red_packet_id
       WHERE c.user_id = $1
       ORDER BY c.claimed_at DESC
       LIMIT 50;`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      history: historyRes.rows.map(row => ({
        id: row.id,
        code: row.code,
        amount: parseFloat(row.amount || 0),
        title: row.title,
        createdBy: row.created_by,
        claimedAt: row.claimed_at
      }))
    });

  } catch (error) {
    console.error('Fetch Red Packet History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Red Packet claim history.' },
      { status: 500 }
    );
  }
}
