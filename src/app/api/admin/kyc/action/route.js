import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { kycId, userUid, action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    const normalizedAction = action.toLowerCase();

    // ---------------- BULK APPROVE ALL PENDING KYC ----------------
    if (normalizedAction === 'approve_all' || normalizedAction === 'approveall') {
      const pendingUsersRes = await query(
        `SELECT u.id, u.uid FROM users u
         WHERE LOWER(u.kyc_status) = 'pending' OR LOWER(u.kyc_status) = 'unverified'
            OR u.id IN (SELECT user_id FROM kyc_verifications WHERE LOWER(status) = 'pending');`
      );

      let approvedCount = 0;
      for (const row of pendingUsersRes.rows) {
        const uId = row.id;
        const uUid = row.uid;

        // Update kyc_verifications & users
        await query(`UPDATE kyc_verifications SET status = 'verified', reviewed_at = CURRENT_TIMESTAMP WHERE user_id = $1;`, [uId]);
        await query(`UPDATE users SET kyc_status = 'verified', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`, [uId]);

        // Credit $2.10 USDT reward
        try {
          const balCheck = await query(`SELECT id FROM balances WHERE user_id = $1;`, [uId]);
          if (balCheck.rows.length > 0) {
            await query(
              `UPDATE balances 
               SET total_usdt = total_usdt + 2.10,
                   available_usdt = available_usdt + 2.10,
                   spot_usdt = spot_usdt + 2.10,
                   updated_at = CURRENT_TIMESTAMP
               WHERE user_id = $1;`,
              [uId]
            );
          } else {
            await query(
              `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt)
               VALUES ($1, 2.10, 2.10, 2.10, 0.00, 0.00);`,
              [uId]
            );
          }
        } catch (bErr) {
          console.warn('Balance credit error:', bErr.message);
        }

        // Send notification
        try {
          await query(
            `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
             VALUES ($1, 'KYC Approved', 'Your KYC success, 2.1$ receive', 'reward', 2.10, false);`,
            [uId]
          );
        } catch (nErr) {}

        approvedCount++;
      }

      return NextResponse.json({
        success: true,
        message: `Successfully approved all ${approvedCount} pending KYC applications!`,
        approvedCount
      });
    }

    if (!kycId && !userUid) {
      return NextResponse.json(
        { success: false, error: 'KYC ID or User UID required' },
        { status: 400 }
      );
    }

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

      // Check if user was referred by someone and award referral bonus
      try {
        const refUserRes = await query(
          `SELECT referred_by_user_id, referral_reward_claimed FROM users WHERE id = $1;`,
          [targetUserId]
        );
        if (refUserRes.rows.length > 0) {
          const { referred_by_user_id, referral_reward_claimed } = refUserRes.rows[0];

          if (referred_by_user_id && !referral_reward_claimed) {
            // Count how many verified referral rewards have been claimed by this referrer so far
            const claimedCountRes = await query(
              `SELECT COUNT(*)::int AS count 
               FROM users 
               WHERE referred_by_user_id = $1 
                 AND kyc_status = 'verified' 
                 AND referral_reward_claimed = TRUE;`,
              [referred_by_user_id]
            );

            const alreadyClaimedCount = parseInt(claimedCountRes.rows[0]?.count || '0', 10);

            // Determine if balance should be credited (+0.50 USDT)
            // - First 10 referrals: Every 1 referral gives +0.50 USDT
            // - 11+ referrals: Every 2 referrals give +0.50 USDT (odd index = wait for pair, even index = +0.50)
            let shouldCreditBalance = false;

            if (alreadyClaimedCount < 10) {
              shouldCreditBalance = true;
            } else {
              const afterTenIndex = alreadyClaimedCount - 10;
              shouldCreditBalance = afterTenIndex % 2 === 1;
            }

            if (shouldCreditBalance) {
              // 1. Credit +0.50 USDT to referrer
              await query(
                `UPDATE balances 
                 SET total_usdt = total_usdt + 0.50,
                     available_usdt = available_usdt + 0.50,
                     spot_usdt = spot_usdt + 0.50,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $1;`,
                [referred_by_user_id]
              );
            }

            // 2. Mark reward as claimed for this referred user (so UI always displays "+0.5$ added")
            await query(
              `UPDATE users SET referral_reward_claimed = TRUE WHERE id = $1;`,
              [targetUserId]
            );

            // 3. Record history in database
            await query(
              `INSERT INTO user_history (user_id, user_email, user_uid, type, title, amount, status)
               VALUES ($1, (SELECT email FROM users WHERE id = $1), (SELECT uid FROM users WHERE id = $1), 'Referral', 'you have recive 0.5$', '+0.50 USDT', 'Completed');`,
              [referred_by_user_id]
            );

            // 4. Send notification to referrer
            const notiMsg = shouldCreditBalance
              ? 'Your referral completed KYC! +0.50 USDT credited.'
              : 'Your referral completed KYC! Complete 1 more referral to unlock +0.50 USDT bonus.';

            await query(
              `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
               VALUES ($1, 'Referral Reward Received', $2, 'reward', $3, false);`,
              [referred_by_user_id, notiMsg, shouldCreditBalance ? 0.50 : 0.00]
            );
          }
        }
      } catch (refBonusErr) {
        console.warn('Could not credit referral bonus:', refBonusErr.message);
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
