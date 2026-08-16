import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

const coinColMap = {
  USDT: 'available_usdt',
  BTC: 'btc_balance',
  BNB: 'bnb_balance',
  TON: 'ton_balance',
  TRX: 'trx_balance',
  ETH: 'eth_balance',
  SOL: 'sol_balance'
};

const COIN_RATES = {
  USDT: 1,
  BTC: 64037.84,
  BNB: 570.00,
  TON: 6.80,
  TRX: 0.13,
  ETH: 3450.00,
  SOL: 145.50
};

export async function POST(request) {
  const client = await pool.connect();

  try {
    await initializeDatabase();
    const body = await request.json();
    const { userUid, userEmail, fromCoin, toCoin, fromAmount, toAmount, feeUsdt = 0.1 } = body;

    const numFromAmount = parseFloat(fromAmount);
    let numToAmount = parseFloat(toAmount);
    const numFee = parseFloat(feeUsdt);

    const fromUpper = (fromCoin || '').toUpperCase();
    const toUpper = (toCoin || '').toUpperCase();

    if ((!userUid && !userEmail) || isNaN(numFromAmount) || numFromAmount <= 0 || !fromUpper || !toUpper) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'User UID/Email, valid coins, and positive amount are required.' },
        { status: 400 }
      );
    }

    if (fromUpper === toUpper) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Cannot convert a coin to itself.' },
        { status: 400 }
      );
    }

    const fromRate = COIN_RATES[fromUpper] || 1;
    const orderUsdtVal = numFromAmount * fromRate;
    if (orderUsdtVal < 1) {
      client.release();
      return NextResponse.json(
        { success: false, error: 'Minimum convert amount is 1 USDT.' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. Lock user and balance rows
    const userRes = await client.query(
      `SELECT u.id, u.uid, u.username, u.email, 
              COALESCE(b.total_usdt, 0.00) AS total_usdt, 
              COALESCE(b.available_usdt, 0.00) AS available_usdt,
              COALESCE(b.btc_balance, 0.00) AS btc_balance,
              COALESCE(b.bnb_balance, 0.00) AS bnb_balance,
              COALESCE(b.ton_balance, 0.00) AS ton_balance,
              COALESCE(b.trx_balance, 0.00) AS trx_balance,
              COALESCE(b.eth_balance, 0.00) AS eth_balance,
              COALESCE(b.sol_balance, 0.00) AS sol_balance
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
    const currentAvailableUsdt = parseFloat(userRow.available_usdt || 0);
    const currentTotalUsdt = parseFloat(userRow.total_usdt || 0);

    // 2. Check source coin balance ONLY (No separate USDT requirement!)
    let currentFromBalance = 0;
    if (fromUpper === 'USDT') {
      currentFromBalance = currentAvailableUsdt;
      if (currentFromBalance < numFromAmount) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Insufficient USDT balance. Available: $${currentFromBalance.toFixed(2)} USDT` },
          { status: 400 }
        );
      }
    } else {
      const fromCol = coinColMap[fromUpper];
      if (!fromCol) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Unsupported source coin: ${fromUpper}` },
          { status: 400 }
        );
      }
      currentFromBalance = parseFloat(userRow[fromCol] || 0);
      if (currentFromBalance < numFromAmount) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: `Insufficient ${fromUpper} balance. Available: ${currentFromBalance} ${fromUpper}` },
          { status: 400 }
        );
      }
    }

    // 3. Recalculate net toAmount with $0.10 USD fee deducted from trade output
    const toRate = COIN_RATES[toUpper] || 1;
    const exchangeRate = fromRate / toRate;
    const grossToAmount = numFromAmount * exchangeRate;

    if (toUpper === 'USDT') {
      numToAmount = Math.max(0, grossToAmount - numFee);
    } else if (fromUpper === 'USDT') {
      const netFromUsdt = Math.max(0, numFromAmount - numFee);
      numToAmount = netFromUsdt * exchangeRate;
    } else {
      const feeInToCoin = numFee / toRate;
      numToAmount = Math.max(0, grossToAmount - feeInToCoin);
    }

    // 4. Update database balances
    let newAvailableUsdt = currentAvailableUsdt;
    let newTotalUsdt = currentTotalUsdt;

    const updates = [`updated_at = CURRENT_TIMESTAMP`];

    // Deduct fromCoin
    if (fromUpper === 'USDT') {
      newAvailableUsdt = Math.max(0, currentAvailableUsdt - numFromAmount);
      newTotalUsdt = Math.max(0, currentTotalUsdt - numFromAmount);
    } else {
      const fromCol = coinColMap[fromUpper];
      const newFromVal = Math.max(0, currentFromBalance - numFromAmount);
      updates.push(`${fromCol} = ${newFromVal}`);
    }

    // Add toCoin
    if (toUpper === 'USDT') {
      newAvailableUsdt += numToAmount;
      newTotalUsdt += numToAmount;
    } else {
      const toCol = coinColMap[toUpper];
      if (toCol) {
        const currentToVal = parseFloat(userRow[toCol] || 0);
        const newToVal = currentToVal + numToAmount;
        updates.push(`${toCol} = ${newToVal}`);
      }
    }

    updates.push(`total_usdt = ${newTotalUsdt}`);
    updates.push(`available_usdt = ${newAvailableUsdt}`);

    await client.query(
      `UPDATE balances SET ${updates.join(', ')} WHERE user_id = $1;`,
      [userId]
    );

    // 5. Log transaction
    await client.query(
      `INSERT INTO balance_transactions (user_id, type, asset, amount, balance_before, balance_after, note)
       VALUES ($1, 'convert', $2, $3, $4, $5, $6);`,
      [
        userId,
        `${fromUpper}_TO_${toUpper}`,
        numFromAmount,
        currentTotalUsdt,
        newTotalUsdt,
        `Converted ${numFromAmount} ${fromUpper} to ${numToAmount.toFixed(8)} ${toUpper} (Fee $${numFee.toFixed(2)} deducted from trade)`
      ]
    );

    // 6. Create user notification
    await client.query(
      `INSERT INTO user_notifications (user_id, title, message, type, amount, is_read)
       VALUES ($1, 'Crypto Converted Successfully', $2, 'convert', $3, false);`,
      [
        userId,
        `Successfully converted ${numFromAmount} ${fromUpper} to ${numToAmount.toFixed(6)} ${toUpper}. Fee: $${numFee.toFixed(2)} deducted.`,
        numFromAmount
      ]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: `Successfully converted ${numFromAmount} ${fromUpper} -> ${numToAmount.toFixed(8)} ${toUpper}!`,
      newTotalUsdt,
      convertedData: {
        fromCoin: fromUpper,
        toCoin: toUpper,
        fromAmount: numFromAmount,
        toAmount: numToAmount,
        feeUsdt: numFee
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Convert API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing coin conversion.' },
      { status: 500 }
    );
  }
}
