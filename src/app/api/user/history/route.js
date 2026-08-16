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
      return NextResponse.json({ success: true, history: [] });
    }

    // 1. Fetch user ID
    let userId = null;
    let userEmail = email || '';
    let userUid = uid || '';

    const userRes = await query(
      `SELECT id, email, uid FROM users WHERE uid = $1 OR LOWER(email) = LOWER($2) LIMIT 1;`,
      [uid || 'NO_UID', email || 'NO_EMAIL']
    );

    if (userRes.rows.length > 0) {
      userId = userRes.rows[0].id;
      userEmail = userRes.rows[0].email || userEmail;
      userUid = userRes.rows[0].uid || userUid;
    }

    if (!userId) {
      return NextResponse.json({ success: true, history: [] });
    }

    let items = [];

    // 2. Query user_history table
    const historyRes = await query(
      `SELECT id::text, type, title, amount, status, tx_hash AS "txHash", created_at AS "createdAt"
       FROM user_history 
       WHERE user_id = $1 OR LOWER(user_email) = LOWER($2) OR user_uid = $3;`,
      [userId, userEmail, userUid]
    );
    items.push(...historyRes.rows);

    // 3. Query deposits table (Includes Admin Balance Adds)
    const depositsRes = await query(
      `SELECT id::text, asset, amount, status, tx_hash AS "txHash", created_at AS "createdAt", deposit_address
       FROM deposits 
       WHERE user_id = $1;`,
      [userId]
    );
    depositsRes.rows.forEach(d => {
      const amtNum = parseFloat(d.amount || 0);
      const formattedAmt = `+${amtNum.toFixed(2)} ${d.asset || 'USDT'}`;
      const statusRaw = (d.status || 'completed').toLowerCase();
      const statusStr = statusRaw === 'completed' ? 'Completed' : statusRaw === 'pending' ? 'Pending' : 'Failed';
      const isAdminAdd = d.deposit_address === 'Admin System Balance Add';

      items.push({
        id: `dep-${d.id}`,
        type: 'Deposit',
        title: isAdminAdd ? `Deposit +${amtNum.toFixed(2)} ${d.asset || 'USDT'}` : `Deposit ${d.asset || 'USDT'}`,
        amount: formattedAmt,
        status: statusStr,
        txHash: d.txHash || `0x${d.id}dep`,
        createdAt: d.createdAt
      });
    });

    // 4. Query withdrawals table
    const withdrawalsRes = await query(
      `SELECT id::text, asset, amount, status, destination_address, created_at AS "createdAt"
       FROM withdrawals 
       WHERE user_id = $1;`,
      [userId]
    );
    withdrawalsRes.rows.forEach(w => {
      const amtNum = parseFloat(w.amount || 0);
      const formattedAmt = `-${amtNum.toFixed(2)} ${w.asset || 'USDT'}`;
      let statusStr = 'Completed';
      const statusRaw = (w.status || '').toLowerCase();
      if (statusRaw === 'pending') statusStr = 'Pending';
      if (statusRaw === 'rejected') statusStr = 'Rejected';

      items.push({
        id: `wdr-${w.id}`,
        type: 'Withdraw',
        title: `Withdrawal ${w.asset || 'USDT'}`,
        amount: formattedAmt,
        status: statusStr,
        txHash: `0xWDR${w.id}`,
        createdAt: w.createdAt
      });
    });

    // 5. Query balance_transactions table for deductions / transfers
    const btRes = await query(
      `SELECT id::text, type, asset, amount, note, created_at AS "createdAt"
       FROM balance_transactions 
       WHERE user_id = $1;`,
      [userId]
    );
    btRes.rows.forEach(bt => {
      const amtNum = parseFloat(bt.amount || 0);
      const isDeduct = bt.type === 'admin_deduct';
      
      // Admin adds are already in deposits table, so skip to prevent duplication
      if (bt.type === 'admin_add') return;

      items.push({
        id: `bt-${bt.id}`,
        type: isDeduct ? 'Deduct' : 'Transfer',
        title: bt.note || (isDeduct ? `Balance Deduction` : `Transaction`),
        amount: `${isDeduct ? '-' : '+'}${amtNum.toFixed(2)} ${bt.asset || 'USDT'}`,
        status: 'Completed',
        txHash: `0xBT${bt.id}`,
        createdAt: bt.createdAt
      });
    });

    // 6. Check referral claimed bonuses
    const refUsersRes = await query(
      `SELECT uid, email, updated_at FROM users 
       WHERE referred_by_user_id = $1 AND kyc_status = 'verified' AND referral_reward_claimed = TRUE;`,
      [userId]
    );
    if (refUsersRes.rows.length > 0) {
      refUsersRes.rows.forEach(r => {
        const exists = items.some(i => (i.title || '').toLowerCase().includes('0.5$') || i.id === `ref-${r.uid}`);
        if (!exists) {
          items.push({
            id: `ref-${r.uid}`,
            type: 'Referral',
            title: 'you have recive 0.5$',
            amount: '+0.50 USDT',
            status: 'Completed',
            txHash: '0x' + Math.random().toString(16).slice(2, 10),
            createdAt: r.updated_at
          });
        }
      });
    }

    // Deduplicate & Sort items by date descending
    const uniqueItems = [];
    const seenKeys = new Set();

    for (const item of items) {
      const timestamp = new Date(item.createdAt || Date.now()).getTime();
      const key = `${item.type}_${item.amount}_${Math.floor(timestamp / 1000)}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueItems.push(item);
      }
    }

    uniqueItems.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));

    return NextResponse.json({
      success: true,
      history: uniqueItems
    });
  } catch (error) {
    console.error('Fetch User History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching history.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { uid, email, type, title, amount, status, txHash } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    let userId = null;
    if (uid || email) {
      const uRes = await query(
        `SELECT id, email, uid FROM users WHERE uid = $1 OR LOWER(email) = LOWER($2) LIMIT 1;`,
        [uid || 'NO_UID', email || 'NO_EMAIL']
      );
      if (uRes.rows.length > 0) {
        userId = uRes.rows[0].id;
      }
    }

    const insertRes = await query(
      `INSERT INTO user_history (user_id, user_email, user_uid, type, title, amount, status, tx_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, type, title, amount, status, tx_hash AS "txHash", created_at AS "createdAt";`,
      [
        userId,
        email || null,
        uid || null,
        type || 'General',
        title,
        amount || '0.00',
        status || 'Completed',
        txHash || null
      ]
    );

    return NextResponse.json({
      success: true,
      item: insertRes.rows[0]
    });
  } catch (error) {
    console.error('Create User History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error creating history item.' },
      { status: 500 }
    );
  }
}
