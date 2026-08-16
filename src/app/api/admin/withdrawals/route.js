import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';
import { verifyAdminAuthorization } from '@/lib/adminAuth';

export async function GET(request) {
  try {
    await initializeDatabase();
    
    // Server-side Admin Authorization check
    const authCheck = verifyAdminAuthorization(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: 403 }
      );
    }

    const result = await query(`
      SELECT 
        w.id AS withdrawal_id,
        w.asset,
        w.amount,
        w.destination_address,
        w.chain,
        w.fee,
        w.status AS withdrawal_status,
        w.created_at AS withdrawal_time,
        w.reviewed_at,
        u.id AS user_id,
        u.uid,
        u.username,
        u.email,
        u.kyc_status,
        u.created_at AS user_created_at,
        COALESCE(b.total_usdt, 0.00) AS balance,
        COALESCE(b.available_usdt, 0.00) AS available_balance
      FROM withdrawals w
      JOIN users u ON u.id = w.user_id
      LEFT JOIN balances b ON b.user_id = u.id
      ORDER BY w.created_at DESC;
    `);

    const withdrawRequests = result.rows.map(row => {
      const formattedStatus = row.withdrawal_status 
        ? row.withdrawal_status.charAt(0).toUpperCase() + row.withdrawal_status.slice(1).toLowerCase() 
        : 'Pending';

      const formattedKyc = row.kyc_status 
        ? row.kyc_status.charAt(0).toUpperCase() + row.kyc_status.slice(1).toLowerCase() 
        : 'Unverified';

      const formattedTime = row.withdrawal_time 
        ? new Date(row.withdrawal_time).toISOString().replace('T', ' ').substring(0, 16) 
        : 'N/A';

      return {
        id: `WDR-${row.withdrawal_id}`,
        withdrawalId: row.withdrawal_id,
        uid: row.uid,
        username: row.username,
        email: row.email,
        coin: row.asset || 'USDT',
        network: row.chain || 'BEP20',
        amount: parseFloat(row.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        rawAmount: parseFloat(row.amount || 0),
        address: row.destination_address,
        time: formattedTime,
        status: formattedStatus,
        kycStatus: formattedKyc,
        balance: parseFloat(row.balance || 0),
        referralCount: 0
      };
    });

    return NextResponse.json({
      success: true,
      withdrawRequests,
      pendingCount: withdrawRequests.filter(r => r.status === 'Pending').length
    });

  } catch (error) {
    console.error('Admin Withdrawals GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching withdrawal requests.' },
      { status: 500 }
    );
  }
}
