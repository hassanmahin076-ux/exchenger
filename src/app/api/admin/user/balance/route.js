import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';
import { verifyAdminAuthorization } from '@/lib/adminAuth';

export async function POST(request) {
  const client = await pool.connect();

  try {
    await initializeDatabase();
    
    // Server-side Admin Authorization check
    const authCheck = verifyAdminAuthorization(request);
    if (!authCheck.isAuthorized) {
      client.release();
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { targetUid, action, amount, note } = body;

    const numAmount = parseFloat(amount);

    if (!targetUid || !action || isNaN(numAmount) || numAmount <= 0) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Valid Target UID, Action (add/deduct), and positive Amount are required' },
        { status: 400 }
      );
    }

    const normalizedAction = action.toLowerCase();
    if (normalizedAction !== 'add' && normalizedAction !== 'deduct') {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Action must be "add" or "deduct"' },
        { status: 400 }
      );
    }

    // Begin PostgreSQL Database Transaction
    await client.query('BEGIN');

    // 1. Lock user row for safe update
    const userRes = await client.query(
      `SELECT u.id, u.uid, u.username, COALESCE(b.total_usdt, 0.00) AS total_usdt, COALESCE(b.available_usdt, 0.00) AS available_usdt, COALESCE(b.spot_usdt, 0.00) AS spot_usdt
       FROM users u
       LEFT JOIN balances b ON b.user_id = u.id
       WHERE u.uid = $1
       FOR UPDATE OF u;`,
      [targetUid]
    );

    if (userRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: `User with UID ${targetUid} not found.` },
        { status: 404 }
      );
    }

    const userRow = userRes.rows[0];
    const userId = userRow.id;
    const currentTotal = parseFloat(userRow.total_usdt || 0);
    const currentAvailable = parseFloat(userRow.available_usdt || 0);
    const currentSpot = parseFloat(userRow.spot_usdt || 0);

    let newTotal = currentTotal;
    let newAvailable = currentAvailable;
    let newSpot = currentSpot;

    if (normalizedAction === 'add') {
      newTotal += numAmount;
      newAvailable += numAmount;
      newSpot += numAmount;
    } else {
      // Deduct action validation: prevent negative balance
      if (currentAvailable < numAmount) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Insufficient available balance! Current: $${currentAvailable.toFixed(2)} USDT, requested deduction: $${numAmount.toFixed(2)} USDT` },
          { status: 400 }
        );
      }
      newTotal = Math.max(0, currentTotal - numAmount);
      newAvailable = Math.max(0, currentAvailable - numAmount);
      newSpot = Math.max(0, currentSpot - numAmount);
    }

    // 2. Check if balance record exists and update / insert without ON CONFLICT dependency
    const balCheck = await client.query(
      `SELECT id FROM balances WHERE user_id = $1;`,
      [userId]
    );

    if (balCheck.rows.length > 0) {
      await client.query(
        `UPDATE balances
         SET total_usdt = $1,
             available_usdt = $2,
             spot_usdt = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4;`,
        [newTotal, newAvailable, newSpot, userId]
      );
    } else {
      await client.query(
        `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt, updated_at)
         VALUES ($1, $2, $3, $4, 0.00, 0.00, CURRENT_TIMESTAMP);`,
        [userId, newTotal, newAvailable, newSpot]
      );
    }

    // 3. Log transaction in balance_transactions
    await client.query(
      `INSERT INTO balance_transactions (user_id, admin_uid, type, asset, amount, balance_before, balance_after, note)
       VALUES ($1, $2, $3, 'USDT', $4, $5, $6, $7);`,
      [
        userId,
        'SUPER_ADMIN',
        normalizedAction === 'add' ? 'admin_add' : 'admin_deduct',
        numAmount,
        currentTotal,
        newTotal,
        note || `Admin ${normalizedAction} balance`
      ]
    );

    // 4. Create deposit record & unread notification for user when balance is added
    if (normalizedAction === 'add') {
      try {
        // Record deposit into deposits table for real-time Total Deposits calculation
        const txHash = 'ADM_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        await client.query(
          `INSERT INTO deposits (user_id, asset, amount, tx_hash, deposit_address, status)
           VALUES ($1, 'USDT', $2, $3, 'Admin System Balance Add', 'completed');`,
          [userId, numAmount, txHash]
        );

        await client.query(
          `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
           VALUES ($1, $2, $3, $4, $5, false);`,
          [
            userId,
            'Deposit Successful',
            'Your deposit credit',
            'deposit',
            numAmount
          ]
        );
      } catch (notiErr) {
        console.warn('Could not insert balance add deposit/notification record:', notiErr.message);
      }
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Successfully ${normalizedAction === 'add' ? 'added' : 'deducted'} $${numAmount.toFixed(2)} USDT for UID ${targetUid}`,
      newBalance: newTotal
    });

  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Admin Balance Management API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing balance management.' },
      { status: 500 }
    );
  }
}
