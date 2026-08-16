import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  const client = await pool.connect();

  try {
    await initializeDatabase();
    const body = await request.json();
    const { userUid, userEmail, coin, chain, amount, destinationAddress } = body;

    const numAmount = parseFloat(amount);

    if ((!userUid && !userEmail) || !destinationAddress || isNaN(numAmount) || numAmount <= 0) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'User UID/Email, valid destination address, and positive amount are required.' },
        { status: 400 }
      );
    }

    const assetSymbol = (coin || 'USDT').toUpperCase();
    const chainName = chain || 'BEP20';

    await client.query('BEGIN');

    // 1. Lock user and balance rows
    const userRes = await client.query(
      `SELECT u.id, u.uid, u.username, u.email, COALESCE(b.total_usdt, 0.00) AS total_usdt, COALESCE(b.available_usdt, 0.00) AS available_usdt
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
      return NextResponse.json(
        { success: false, error: 'User not found. Please log in first.' },
        { status: 404 }
      );
    }

    const userRow = userRes.rows[0];
    const userId = userRow.id;
    const currentTotal = parseFloat(userRow.total_usdt || 0);
    const currentAvailable = parseFloat(userRow.available_usdt || 0);

    // 2. Validate balance sufficiency
    if (currentAvailable < numAmount) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: `Insufficient available balance! You have $${currentAvailable.toFixed(2)} USDT available.` },
        { status: 400 }
      );
    }

    // 3. Deduct main balance (both total_usdt and available_usdt) for pending withdrawal
    const newTotal = Math.max(0, currentTotal - numAmount);
    const newAvailable = Math.max(0, currentAvailable - numAmount);

    await client.query(
      `UPDATE balances 
       SET total_usdt = $1, available_usdt = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $3;`,
      [newTotal, newAvailable, userId]
    );

    // 4. Create pending withdrawal record
    const withdrawalRes = await client.query(
      `INSERT INTO withdrawals (user_id, asset, amount, destination_address, chain, fee, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 0.0000, 'pending', CURRENT_TIMESTAMP)
       RETURNING id, status, created_at;`,
      [userId, assetSymbol, numAmount, destinationAddress, chainName]
    );

    const withdrawal = withdrawalRes.rows[0];

    // 5. Create user pending notification
    await client.query(
      `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
       VALUES ($1, 'Withdrawal Pending', $2, 'withdrawal', $3, false);`,
      [
        userId,
        `Withdrawal Request Pending: Your withdrawal request of $${numAmount.toFixed(2)} ${assetSymbol} has been submitted and is currently under review.`,
        numAmount
      ]
    );

    // 6. Log transaction
    await client.query(
      `INSERT INTO balance_transactions (user_id, type, asset, amount, balance_before, balance_after, note)
       VALUES ($1, 'withdrawal_request', $2, $3, $4, $5, $6);`,
      [userId, assetSymbol, numAmount, currentTotal, newTotal, `Withdrawal request ID #${withdrawal.id}`]
    );

    // 7. Record in user_history table
    await client.query(
      `INSERT INTO user_history (user_id, user_email, user_uid, type, title, amount, status)
       VALUES ($1, $2, $3, 'Withdraw', $4, $5, 'Pending');`,
      [userId, userRow.email, userRow.uid, `Withdraw ${assetSymbol}`, `-${numAmount.toFixed(2)} ${assetSymbol}`]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Withdrawal request for ${numAmount.toFixed(2)} ${assetSymbol} submitted successfully!`,
      withdrawal: {
        id: withdrawal.id,
        status: 'pending',
        amount: numAmount,
        asset: assetSymbol,
        createdAt: withdrawal.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Withdrawal Submit API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error submitting withdrawal request.' },
      { status: 500 }
    );
  }
}
