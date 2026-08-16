import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

const COIN_RATES = {
  USDT: 1,
  BTC: 64037.84,
  BNB: 570.00,
  TON: 6.80,
  TRX: 0.13,
  ETH: 3450.00,
  SOL: 145.50
};

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const uid = (searchParams.get('uid') || '').trim();
    const email = (searchParams.get('email') || '').trim();

    if (!uid && !email) {
      return NextResponse.json(
        { success: false, error: 'User UID or Email parameter required' },
        { status: 400 }
      );
    }

    // Query user profile and balances using parameterized SQL query
    const userResult = await query(
      `SELECT 
        u.id, 
        u.uid, 
        u.username, 
        u.email, 
        u.kyc_status,
        COALESCE(b.total_usdt, 0.00) AS total_usdt,
        COALESCE(b.available_usdt, 0.00) AS available_usdt,
        COALESCE(b.spot_usdt, 0.00) AS spot_usdt,
        COALESCE(b.futures_usdt, 0.00) AS futures_usdt,
        COALESCE(b.staked_usdt, 0.00) AS staked_usdt,
        COALESCE(b.btc_balance, 0.00000000) AS btc_balance,
        COALESCE(b.bnb_balance, 0.00000000) AS bnb_balance,
        COALESCE(b.ton_balance, 0.00000000) AS ton_balance,
        COALESCE(b.trx_balance, 0.00000000) AS trx_balance,
        COALESCE(b.eth_balance, 0.00000000) AS eth_balance,
        COALESCE(b.sol_balance, 0.00000000) AS sol_balance
       FROM users u
       LEFT JOIN balances b ON b.user_id = u.id
       WHERE (u.uid IS NOT NULL AND u.uid = $1)
          OR (u.email IS NOT NULL AND LOWER(u.email) = LOWER($2))
          OR (u.username IS NOT NULL AND LOWER(u.username) = LOWER($2));`,
      [uid || 'NO_UID', email.toLowerCase() || 'NO_EMAIL']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const row = userResult.rows[0];

    const usdtAmt = parseFloat(row.available_usdt !== undefined ? row.available_usdt : (row.total_usdt || 0));
    const btcAmt = parseFloat(row.btc_balance || 0);
    const bnbAmt = parseFloat(row.bnb_balance || 0);
    const tonAmt = parseFloat(row.ton_balance || 0);
    const trxAmt = parseFloat(row.trx_balance || 0);
    const ethAmt = parseFloat(row.eth_balance || 0);
    const solAmt = parseFloat(row.sol_balance || 0);

    const rawSpot = parseFloat(row.spot_usdt || 0);
    const futuresAmt = parseFloat(row.futures_usdt || 0);
    const maxPossibleSpot = Math.max(0, usdtAmt - futuresAmt);
    const calcSpot = rawSpot > 0 ? Math.min(rawSpot, maxPossibleSpot) : maxPossibleSpot;

    if (Math.abs(rawSpot - calcSpot) > 0.0001 && row.id) {
      try {
        await query(`UPDATE balances SET spot_usdt = $1 WHERE user_id = $2;`, [calcSpot, row.id]);
      } catch (syncErr) {
        console.warn('Sync spot_usdt error:', syncErr.message);
      }
    }

    const totalPortfolioUsdt = 
      (usdtAmt * COIN_RATES.USDT) +
      (btcAmt * COIN_RATES.BTC) +
      (bnbAmt * COIN_RATES.BNB) +
      (tonAmt * COIN_RATES.TON) +
      (trxAmt * COIN_RATES.TRX) +
      (ethAmt * COIN_RATES.ETH) +
      (solAmt * COIN_RATES.SOL);

    return NextResponse.json({
      success: true,
      user: {
        id: row.id,
        uid: row.uid,
        username: row.username,
        email: row.email,
        kycStatus: row.kyc_status || 'unverified',
      },
      balance: {
        totalUsdt: totalPortfolioUsdt,
        totalPortfolioUsdt: totalPortfolioUsdt,
        rawTotalUsdt: parseFloat(row.total_usdt || 0),
        availableUsdt: usdtAmt,
        spotUsdt: calcSpot,
        futuresUsdt: futuresAmt,
        stakedUsdt: parseFloat(row.staked_usdt || 0),
        btc: btcAmt,
        bnb: bnbAmt,
        ton: tonAmt,
        trx: trxAmt,
        eth: ethAmt,
        sol: solAmt,
      }
    });

  } catch (error) {
    console.error('User Balance API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching user balance.' },
      { status: 500 }
    );
  }
}
