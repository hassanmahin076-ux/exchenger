import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  const client = await pool.connect();

  try {
    await initializeDatabase();
    const body = await request.json();
    const { userUid, userEmail, code } = body;

    const trimmedCode = (code || '').trim();

    if ((!userUid && !userEmail) || !trimmedCode) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'User info and Red Packet code are required.' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. Lock user row
    const userRes = await client.query(
      `SELECT id, uid, username, email FROM users
       WHERE (uid IS NOT NULL AND uid = $1)
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2))
       FOR UPDATE;`,
      [userUid || 'NO_UID', (userEmail || 'NO_EMAIL').toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: 'User not found. Please log in first.' },
        { status: 404 }
      );
    }

    const userId = userRes.rows[0].id;

    // 2. Find Red Packet
    const packetRes = await client.query(
      `SELECT * FROM red_packets WHERE LOWER(code) = LOWER($1) FOR UPDATE;`,
      [trimmedCode]
    );

    if (packetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: 'Invalid or expired Red Packet code.' },
        { status: 404 }
      );
    }

    const packet = packetRes.rows[0];

    if (!packet.is_active) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: 'This Red Packet is no longer active.' },
        { status: 400 }
      );
    }

    if (packet.claimed_count >= packet.max_claims) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: 'All Red Packets for this code have been fully claimed!' },
        { status: 400 }
      );
    }

    // 3. Check if user already claimed
    const existingClaimRes = await client.query(
      `SELECT id FROM red_packet_claims WHERE red_packet_id = $1 AND user_id = $2;`,
      [packet.id, userId]
    );

    if (existingClaimRes.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: 'You have already claimed this Red Packet!' },
        { status: 400 }
      );
    }

    const rewardAmount = parseFloat(packet.amount_per_user || 0);

    // 4. Lock balance row & update user USDT balance
    const balRes = await client.query(
      `SELECT available_usdt, total_usdt FROM balances WHERE user_id = $1 FOR UPDATE;`,
      [userId]
    );

    let currentAvail = 0;
    let currentTotal = 0;

    if (balRes.rows.length === 0) {
      await client.query(
        `INSERT INTO balances (user_id, available_usdt, total_usdt) VALUES ($1, $2, $2);`,
        [userId, rewardAmount]
      );
    } else {
      currentAvail = parseFloat(balRes.rows[0].available_usdt || 0);
      currentTotal = parseFloat(balRes.rows[0].total_usdt || 0);
      const newAvail = currentAvail + rewardAmount;
      const newTotal = currentTotal + rewardAmount;

      await client.query(
        `UPDATE balances SET available_usdt = $1, total_usdt = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3;`,
        [newAvail, newTotal, userId]
      );
    }

    // 5. Update Red Packet claim count
    await client.query(
      `UPDATE red_packets SET claimed_count = claimed_count + 1 WHERE id = $1;`,
      [packet.id]
    );

    // 6. Record Claim
    await client.query(
      `INSERT INTO red_packet_claims (red_packet_id, user_id, code, amount) VALUES ($1, $2, $3, $4);`,
      [packet.id, userId, packet.code, rewardAmount]
    );

    // 7. Log Transaction & Notification
    await client.query(
      `INSERT INTO balance_transactions (user_id, type, asset, amount, balance_before, balance_after, note)
       VALUES ($1, 'red_packet', 'USDT', $2, $3, $4, $5);`,
      [
        userId,
        rewardAmount,
        currentTotal,
        currentTotal + rewardAmount,
        `Claimed Red Packet Code ${packet.code} ($${rewardAmount.toFixed(4)} USDT)`
      ]
    );

    await client.query(
      `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
       VALUES ($1, 'Red Packet Claimed!', $2, 'gift', $3, false);`,
      [
        userId,
        `Congratulations! You claimed $${rewardAmount.toFixed(4)} USDT from Red Packet code ${packet.code}.`,
        rewardAmount
      ]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      amount: rewardAmount,
      title: packet.title,
      createdBy: packet.created_by || 'Admin',
      code: packet.code,
      message: `Successfully claimed $${rewardAmount.toFixed(4)} USDT!`
    });

  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Claim Red Packet Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing Red Packet claim.' },
      { status: 500 }
    );
  }
}
