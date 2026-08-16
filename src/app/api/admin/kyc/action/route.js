import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { kycId, userUid, action } = body;

    if (!action || (!kycId && !userUid)) {
      return NextResponse.json(
        { success: false, error: 'KYC ID or User UID and Action are required' },
        { status: 400 }
      );
    }

    const normalizedAction = action.toLowerCase();
    const newStatus = (normalizedAction === 'approve' || normalizedAction === 'verified') ? 'verified' : 'rejected';
    const numericKycId = (kycId && !isNaN(parseInt(kycId, 10))) ? parseInt(kycId, 10) : -1;

    // 1. Update kyc_verifications record using parameterized query
    const kycUpdateResult = await query(
      `UPDATE kyc_verifications 
       SET status = $1, reviewed_at = CURRENT_TIMESTAMP 
       WHERE id = $2 OR user_id = (SELECT id FROM users WHERE uid = $3 LIMIT 1)
       RETURNING id, user_id, status;`,
      [newStatus, numericKycId, userUid || 'NO_UID']
    );

    let targetUserId = null;
    if (kycUpdateResult.rows.length > 0 && kycUpdateResult.rows[0].user_id) {
      targetUserId = kycUpdateResult.rows[0].user_id;
    }
    if (!targetUserId && userUid) {
      const uRes = await query(`SELECT id FROM users WHERE uid = $1 OR LOWER(email) = LOWER($1);`, [userUid]);
      if (uRes.rows.length > 0) targetUserId = uRes.rows[0].id;
    }
    if (!targetUserId && numericKycId > 0) {
      const kRes = await query(`SELECT user_id FROM kyc_verifications WHERE id = $1;`, [numericKycId]);
      if (kRes.rows.length > 0) targetUserId = kRes.rows[0].user_id;
    }

    // 2. Update users table kyc_status using parameterized query
    if (userUid) {
      await query(
        `UPDATE users 
         SET kyc_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE uid = $2;`,
        [newStatus, userUid]
      );
    } else if (targetUserId) {
      await query(
        `UPDATE users 
         SET kyc_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2;`,
        [newStatus, targetUserId]
      );
    }

    // 3. If KYC Approved, add $2.10 USDT bonus reward to user balance & create Binance push notification
    if (newStatus === 'verified' && targetUserId) {
      try {
        const balCheck = await query(`SELECT id FROM balances WHERE user_id = $1;`, [targetUserId]);
        if (balCheck.rows.length > 0) {
          await query(
            `UPDATE balances 
             SET total_usdt = total_usdt + 2.10,
                 available_usdt = available_usdt + 2.10,
                 spot_usdt = spot_usdt + 2.10,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1;`,
            [targetUserId]
          );
        } else {
          await query(
            `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt)
             VALUES ($1, 2.10, 2.10, 2.10, 0.00, 0.00);`,
            [targetUserId]
          );
        }
      } catch (balErr) {
        console.warn('Could not update balance reward for KYC:', balErr.message);
      }

      // Add Binance-style unread notification for the user
      try {
        await query(
          `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
           VALUES ($1, $2, $3, $4, $5, false);`,
          [
            targetUserId,
            'KYC Approved',
            'Your KYC success, 2.1$ receive',
            'reward',
            2.10
          ]
        );
      } catch (notiErr) {
        console.warn('Could not insert KYC notification:', notiErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `KYC application successfully set to ${newStatus}${newStatus === 'verified' ? ' and $2.10 reward added to balance.' : ''}`,
      kycStatus: newStatus
    });

  } catch (error) {
    console.error('Admin KYC Action API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing KYC action.' },
      { status: 500 }
    );
  }
}
