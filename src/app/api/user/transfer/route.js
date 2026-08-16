import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  const client = await pool.connect();
  try {
    await initializeDatabase();
    const body = await request.json();
    const { userUid, userEmail, fromAccount, toAccount, amount } = body;

    const numAmount = parseFloat(amount);
    if ((!userUid && !userEmail) || !fromAccount || !toAccount || isNaN(numAmount) || numAmount <= 0) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'User info, fromAccount, toAccount and positive amount are required' },
        { status: 400 }
      );
    }

    if (fromAccount.toLowerCase() === toAccount.toLowerCase()) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Source and destination accounts must be different' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. Fetch user ID
    const userRes = await client.query(
      `SELECT u.id, u.uid, u.email, COALESCE(b.available_usdt, 0.00) AS available_usdt, COALESCE(b.spot_usdt, 0.00) AS spot_usdt, COALESCE(b.futures_usdt, 0.00) AS futures_usdt
       FROM users u
       LEFT JOIN balances b ON b.user_id = u.id
       WHERE (u.uid IS NOT NULL AND u.uid = $1)
          OR (u.email IS NOT NULL AND LOWER(u.email) = LOWER($2))
       FOR UPDATE OF u;`,
      [userUid || 'NO_UID', (userEmail || 'NO_EMAIL').toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const userRow = userRes.rows[0];
    const userId = userRow.id;
    const currentAvailable = parseFloat(userRow.available_usdt || 0);
    let currentSpot = parseFloat(userRow.spot_usdt || 0);
    if (currentSpot === 0 && currentAvailable > 0) {
      currentSpot = currentAvailable;
    }
    const currentFutures = parseFloat(userRow.futures_usdt || 0);

    const fromAcc = fromAccount.toLowerCase();
    const toAcc = toAccount.toLowerCase();

    let newSpot = currentSpot;
    let newFutures = currentFutures;

    if (fromAcc === 'spot' && toAcc === 'futures') {
      if (currentSpot < numAmount) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Insufficient Spot balance! Current Spot: $${currentSpot.toFixed(2)} USDT` },
          { status: 400 }
        );
      }
      newSpot = Math.max(0, currentSpot - numAmount);
      newFutures = currentFutures + numAmount;
    } else if (fromAcc === 'futures' && toAcc === 'spot') {
      if (currentFutures < numAmount) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Insufficient Futures balance! Current Futures: $${currentFutures.toFixed(2)} USDT` },
          { status: 400 }
        );
      }
      newFutures = Math.max(0, currentFutures - numAmount);
      newSpot = currentSpot + numAmount;
    } else {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Invalid account transfer pair' }, { status: 400 });
    }

    // Update balances
    const balCheck = await client.query(`SELECT id FROM balances WHERE user_id = $1;`, [userId]);
    if (balCheck.rows.length > 0) {
      await client.query(
        `UPDATE balances
         SET spot_usdt = $1,
             futures_usdt = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3;`,
        [newSpot, newFutures, userId]
      );
    } else {
      await client.query(
        `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt, updated_at)
         VALUES ($1, $2, $2, $3, $4, 0.00, CURRENT_TIMESTAMP);`,
        [userId, newSpot + newFutures, newSpot, newFutures]
      );
    }

    // Log history
    try {
      await client.query(
        `INSERT INTO user_history (user_id, user_email, user_uid, type, title, amount, status)
         VALUES ($1, $2, $3, 'Transfer', $4, $5, 'Completed');`,
        [
          userId,
          userRow.email || userEmail,
          userRow.uid || userUid,
          `Transferred ${fromAcc === 'spot' ? 'Spot ➔ Futures' : 'Futures ➔ Spot'}`,
          `${numAmount.toFixed(2)} USDT`
        ]
      );
    } catch (_) {}

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${numAmount.toFixed(2)} USDT from ${fromAcc.toUpperCase()} to ${toAcc.toUpperCase()}`,
      spotUsdt: newSpot,
      futuresUsdt: newFutures
    });

  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (_) {}
      client.release();
    }
    console.error('Transfer API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing transfer.' },
      { status: 500 }
    );
  }
}
