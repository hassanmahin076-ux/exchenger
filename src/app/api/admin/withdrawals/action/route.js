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
    let { withdrawalId, action } = body;

    // Handle withdrawal ID string format like "WDR-9021" or raw integer
    if (typeof withdrawalId === 'string' && withdrawalId.startsWith('WDR-')) {
      withdrawalId = parseInt(withdrawalId.replace('WDR-', ''), 10);
    }

    if (!withdrawalId || !action) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Withdrawal ID and Action (approve/reject) are required' },
        { status: 400 }
      );
    }

    const normalizedAction = action.toLowerCase();
    const newStatus = (normalizedAction === 'approve' || normalizedAction === 'approved') ? 'approved' : 'rejected';

    await client.query('BEGIN');

    // 1. Lock withdrawal row and check current status to prevent double-processing
    const wdrRes = await client.query(
      `SELECT w.id, w.user_id, w.amount, w.asset, w.status
       FROM withdrawals w
       WHERE w.id = $1
       FOR UPDATE;`,
      [withdrawalId]
    );

    if (wdrRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: `Withdrawal record #${withdrawalId} not found.` },
        { status: 404 }
      );
    }

    const wdr = wdrRes.rows[0];

    // Double Approval / Double Processing Protection
    if (wdr.status.toLowerCase() !== 'pending') {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: `Withdrawal #${withdrawalId} has already been processed (Current status: ${wdr.status}).` },
        { status: 400 }
      );
    }

    const userId = wdr.user_id;
    const amountNum = parseFloat(wdr.amount);

    // Lock user balance record
    const balRes = await client.query(
      `SELECT COALESCE(total_usdt, 0.00) AS total_usdt, COALESCE(available_usdt, 0.00) AS available_usdt
       FROM balances
       WHERE user_id = $1
       FOR UPDATE;`,
      [userId]
    );

    const currentTotal = balRes.rows.length > 0 ? parseFloat(balRes.rows[0].total_usdt) : 0;
    const currentAvailable = balRes.rows.length > 0 ? parseFloat(balRes.rows[0].available_usdt) : 0;

    if (newStatus === 'approved') {
      // Main balance was already deducted on submission; send approval notification
      await client.query(
        `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
         VALUES ($1, 'Withdrawal Approved', $2, 'withdrawal', $3, false);`,
        [
          userId,
          `Withdrawal Approved: Your withdrawal request of $${amountNum.toFixed(2)} ${wdr.asset || 'USDT'} has been approved and processed.`,
          amountNum
        ]
      );
    } else {
      // Rejection: Refund deducted amount back to main balance (both total_usdt & available_usdt)
      const newTotal = currentTotal + amountNum;
      const newAvailable = currentAvailable + amountNum;
      await client.query(
        `UPDATE balances
         SET total_usdt = $1, available_usdt = $2, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3;`,
        [newTotal, newAvailable, userId]
      );

      // Send rejection & refund notification
      await client.query(
        `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
         VALUES ($1, 'Withdrawal Rejected', $2, 'withdrawal', $3, false);`,
        [
          userId,
          `Withdrawal Rejected: Your withdrawal request of $${amountNum.toFixed(2)} ${wdr.asset || 'USDT'} was rejected. Funds have been refunded to your main balance.`,
          amountNum
        ]
      );
    }

    // 2. Update withdrawal status
    await client.query(
      `UPDATE withdrawals
       SET status = $1, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2;`,
      [newStatus, withdrawalId]
    );

    // 3. Log transaction
    await client.query(
      `INSERT INTO balance_transactions (user_id, admin_uid, type, asset, amount, balance_before, balance_after, note)
       VALUES ($1, 'SUPER_ADMIN', $2, $3, $4, $5, $6, $7);`,
      [
        userId,
        newStatus === 'approved' ? 'withdrawal_approved' : 'withdrawal_rejected',
        wdr.asset || 'USDT',
        amountNum,
        currentTotal,
        newStatus === 'approved' ? Math.max(0, currentTotal - amountNum) : currentTotal,
        `Withdrawal #${withdrawalId} ${newStatus}`
      ]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Withdrawal #${withdrawalId} successfully ${newStatus}!`,
      withdrawalStatus: newStatus
    });

  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Admin Withdrawal Action API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing withdrawal action.' },
      { status: 500 }
    );
  }
}
