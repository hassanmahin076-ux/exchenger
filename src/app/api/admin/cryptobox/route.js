import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET() {
  try {
    await initializeDatabase();

    const res = await pool.query(
      `SELECT id, code, amount_per_user, max_claims, claimed_count, title, created_by, is_active, created_at
       FROM red_packets
       ORDER BY created_at DESC;`
    );

    return NextResponse.json({
      success: true,
      redPackets: res.rows.map(row => ({
        id: row.id,
        code: row.code,
        amountPerUser: parseFloat(row.amount_per_user || 0),
        maxClaims: row.max_claims,
        claimedCount: row.claimed_count,
        title: row.title,
        createdBy: row.created_by,
        isActive: row.is_active,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Admin GET Red Packets Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Red Packets' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { code, amountPerUser, maxClaims = 100, title = 'Red Packet Gift', createdBy = 'Admin' } = body;

    const trimmedCode = (code || '').trim().toUpperCase();
    const numAmount = parseFloat(amountPerUser);
    const numClaims = parseInt(maxClaims, 10);

    if (!trimmedCode || isNaN(numAmount) || numAmount <= 0 || isNaN(numClaims) || numClaims <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid Code, Amount per user (>0), and Max Claims (>0) are required.' },
        { status: 400 }
      );
    }

    const checkRes = await pool.query(
      `SELECT id FROM red_packets WHERE LOWER(code) = LOWER($1);`,
      [trimmedCode]
    );

    if (checkRes.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: `Red Packet code '${trimmedCode}' already exists!` },
        { status: 400 }
      );
    }

    const insertRes = await pool.query(
      `INSERT INTO red_packets (code, amount_per_user, max_claims, title, created_by, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, code, amount_per_user, max_claims, claimed_count, title, created_by, is_active, created_at;`,
      [trimmedCode, numAmount, numClaims, title, createdBy]
    );

    const newPacket = insertRes.rows[0];

    return NextResponse.json({
      success: true,
      message: `Red Packet '${trimmedCode}' created successfully!`,
      redPacket: {
        id: newPacket.id,
        code: newPacket.code,
        amountPerUser: parseFloat(newPacket.amount_per_user || 0),
        maxClaims: newPacket.max_claims,
        claimedCount: newPacket.claimed_count,
        title: newPacket.title,
        createdBy: newPacket.created_by,
        isActive: newPacket.is_active,
        createdAt: newPacket.created_at
      }
    });

  } catch (error) {
    console.error('Admin POST Red Packet Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error creating Red Packet.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Red Packet ID is required.' }, { status: 400 });
    }

    await pool.query(`DELETE FROM red_packets WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Red Packet deleted successfully.'
    });

  } catch (error) {
    console.error('Admin DELETE Red Packet Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete Red Packet.' },
      { status: 500 }
    );
  }
}
