import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json().catch(() => ({}));
    const amount = parseFloat(body.amount || 10000);
    const userId = body.userId || 1;

    // Check if user 1 exists, create if not
    let userRes = await query('SELECT id, uid, username, email FROM users WHERE id = $1 LIMIT 1;', [userId]);
    
    if (userRes.rows.length === 0) {
      // Create default dev user
      const devUid = '999888777';
      const insertUser = await query(
        `INSERT INTO users (uid, username, email, password_hash, vip_level, kyc_status, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, uid, username, email;`,
        [devUid, 'DevTrader', 'devtrader@pokymax.com', '$2a$10$e8nZ9', 'VIP 5', 'verified', 'active']
      );
      userRes = insertUser;
    }

    const currentDevUser = userRes.rows[0];

    // Check balance
    let balRes = await query('SELECT * FROM balances WHERE user_id = $1 LIMIT 1;', [currentDevUser.id]);
    
    if (balRes.rows.length === 0) {
      await query(
        `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt)
         VALUES ($1, $2, $3, $4, 0.0, 0.0);`,
        [currentDevUser.id, amount, amount, amount]
      );
    } else {
      await query(
        `UPDATE balances 
         SET total_usdt = total_usdt + $1, 
             available_usdt = available_usdt + $1, 
             spot_usdt = spot_usdt + $1, 
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2;`,
        [amount, currentDevUser.id]
      );
    }

    // Record balance transaction log
    await query(
      `INSERT INTO balance_transactions (user_id, admin_uid, type, asset, amount, note)
       VALUES ($1, 'DEV_FAUCET', 'FAUCET_DEPOSIT', 'USDT', $2, 'Added via Dev Mode Faucet');`,
      [currentDevUser.id, amount]
    );

    // Fetch updated balance
    const updatedBalRes = await query('SELECT * FROM balances WHERE user_id = $1 LIMIT 1;', [currentDevUser.id]);
    const finalBal = updatedBalRes.rows[0] || {};

    return NextResponse.json({
      success: true,
      message: `Successfully added $${amount.toLocaleString()} USDT test funds!`,
      user: currentDevUser,
      balance: {
        totalUSDT: parseFloat(finalBal.total_usdt || 0),
        availableUSDT: parseFloat(finalBal.available_usdt || 0),
        spotUSDT: parseFloat(finalBal.spot_usdt || 0),
        futuresUSDT: parseFloat(finalBal.futures_usdt || 0),
      }
    });

  } catch (error) {
    console.error('Dev Faucet API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
