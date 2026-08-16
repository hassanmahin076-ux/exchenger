import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const email = searchParams.get('email');

    if (!uid && !email) {
      return NextResponse.json({
        success: true,
        count: 0,
        referrals: []
      });
    }

    // 1. Find logged-in referrer user
    const userRes = await query(
      `SELECT id, uid, email, referral_code 
       FROM users 
       WHERE (uid IS NOT NULL AND uid = $1) 
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2))
       LIMIT 1;`,
      [uid || '', email || '']
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        referrals: []
      });
    }

    const referrer = userRes.rows[0];
    const uidDigits = (referrer.uid || '8392').replace(/\D/g, '').slice(-4);
    const userRefCode = referrer.referral_code || `PKMX${uidDigits}`;

    // Auto-link any referred user registered with referred_by_code
    try {
      await query(
        `UPDATE users
         SET referred_by_user_id = $1
         WHERE referred_by_user_id IS NULL 
           AND referred_by_code IS NOT NULL 
           AND id != $1;`,
        [referrer.id]
      );
    } catch (linkErr) {
      console.warn('Auto link referrals warning:', linkErr.message);
    }

    // 2. Fetch all users referred by this user
    const referralsRes = await query(
      `SELECT id, uid, email, username, kyc_status, referral_reward_claimed, created_at
       FROM users
       WHERE referred_by_user_id = $1 
          OR (referred_by_code IS NOT NULL AND id != $1)
       ORDER BY id DESC;`,
      [referrer.id]
    );

    const referrals = referralsRes.rows.map(row => {
      const rawEmail = row.email || `${row.username}@gmail.com`;
      let maskedEmail = rawEmail;
      if (rawEmail.includes('@')) {
        const [name, domain] = rawEmail.split('@');
        maskedEmail = name.length > 4 ? `${name.slice(0, 4)}***@${domain}` : `${name}***@${domain}`;
      }

      const kyc = (row.kyc_status || 'unverified').toLowerCase();
      const isVerified = kyc === 'verified';
      const isPending = kyc === 'pending' || kyc === 'under_review';

      return {
        id: row.id,
        uid: row.uid,
        email: rawEmail,
        maskedEmail: maskedEmail,
        username: row.username,
        kycStatus: isVerified ? 'verified' : (isPending ? 'pending' : 'unverified'),
        rewardAdded: isVerified || row.referral_reward_claimed,
        createdAt: row.created_at
      };
    });

    return NextResponse.json({
      success: true,
      userRefCode: userRefCode,
      count: referrals.length,
      referrals: referrals
    });

  } catch (error) {
    console.error('Fetch referrals API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching referrals.' },
      { status: 500 }
    );
  }
}
