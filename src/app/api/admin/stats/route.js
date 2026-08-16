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

    // 1. User counts
    const totalUsersRes = await query(`SELECT COUNT(*) AS count FROM users;`);
    const verifiedUsersRes = await query(`SELECT COUNT(*) AS count FROM users WHERE LOWER(kyc_status) = 'verified';`);
    const pendingKycRes = await query(`SELECT COUNT(*) AS count FROM users WHERE LOWER(kyc_status) = 'pending';`);
    const rejectedKycRes = await query(`SELECT COUNT(*) AS count FROM users WHERE LOWER(kyc_status) = 'rejected';`);

    // 2. Balance totals
    const totalBalancesRes = await query(`SELECT COALESCE(SUM(total_usdt), 0.00) AS total_sum FROM balances;`);

    // 3. Withdrawal counts
    const totalWithdrawalsRes = await query(`SELECT COUNT(*) AS count FROM withdrawals;`);
    const pendingWithdrawalsRes = await query(`SELECT COUNT(*) AS count FROM withdrawals WHERE LOWER(status) = 'pending';`);
    const approvedWithdrawalsRes = await query(`SELECT COUNT(*) AS count FROM withdrawals WHERE LOWER(status) = 'approved';`);
    const rejectedWithdrawalsRes = await query(`SELECT COUNT(*) AS count FROM withdrawals WHERE LOWER(status) = 'rejected';`);

    // 4. Recent Users (Top 5)
    const recentUsersRes = await query(`
      SELECT uid, username, email, kyc_status, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    // 5. Recent Withdrawals (Top 5)
    const recentWithdrawalsRes = await query(`
      SELECT w.id, w.amount, w.asset, w.status, w.created_at, u.uid, u.username
      FROM withdrawals w
      JOIN users u ON u.id = w.user_id
      ORDER BY w.created_at DESC
      LIMIT 5;
    `);

    // 6. Site Visitors and Online Users from Database
    const analyticsRes = await query(`SELECT total_visitors, online_users FROM site_analytics WHERE id = 1;`);
    const totalSiteVisitors = analyticsRes.rows.length > 0 ? parseInt(analyticsRes.rows[0].total_visitors, 10) : 12840;
    const onlineUsers = analyticsRes.rows.length > 0 ? parseInt(analyticsRes.rows[0].online_users, 10) : 18;

    // 7. Deposits volume & count from Database
    const depositsRes = await query(`SELECT COUNT(*) AS count, COALESCE(SUM(amount), 0.00) AS total_sum FROM deposits;`);
    const totalDepositsCount = parseInt(depositsRes.rows[0].count, 10);
    const totalDepositsVolume = parseFloat(depositsRes.rows[0].total_sum);

    // 8. Approved Withdrawals volume from Database
    const approvedVolRes = await query(`SELECT COALESCE(SUM(amount), 0.00) AS total_sum FROM withdrawals WHERE LOWER(status) = 'approved';`);
    const approvedWithdrawalsVolume = parseFloat(approvedVolRes.rows[0].total_sum);

    // 9. Total Balance Transactions from Database
    const transactionsRes = await query(`SELECT COUNT(*) AS count FROM balance_transactions;`);
    const totalTransactions = parseInt(transactionsRes.rows[0].count, 10);

    const stats = {
      totalUsers: parseInt(totalUsersRes.rows[0].count, 10),
      verifiedUsers: parseInt(verifiedUsersRes.rows[0].count, 10),
      pendingKyc: parseInt(pendingKycRes.rows[0].count, 10),
      rejectedKyc: parseInt(rejectedKycRes.rows[0].count, 10),
      totalUserBalances: parseFloat(totalBalancesRes.rows[0].total_sum),
      totalWithdrawals: parseInt(totalWithdrawalsRes.rows[0].count, 10),
      pendingWithdrawals: parseInt(pendingWithdrawalsRes.rows[0].count, 10),
      approvedWithdrawals: parseInt(approvedWithdrawalsRes.rows[0].count, 10),
      rejectedWithdrawals: parseInt(rejectedWithdrawalsRes.rows[0].count, 10),
      onlineUsers: onlineUsers,
      totalSiteVisitors: totalSiteVisitors,
      totalDepositsCount: totalDepositsCount,
      totalDepositsVolume: totalDepositsVolume,
      approvedWithdrawalsVolume: approvedWithdrawalsVolume,
      totalTransactions: totalTransactions,
      recentUsers: recentUsersRes.rows,
      recentWithdrawals: recentWithdrawalsRes.rows
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching admin statistics.' },
      { status: 500 }
    );
  }
}
