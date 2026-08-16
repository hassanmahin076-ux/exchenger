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

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();

    let sql = `
      SELECT 
        u.id,
        u.uid,
        u.username,
        u.email,
        u.vip_level,
        u.kyc_status,
        u.status,
        u.created_at,
        u.updated_at,
        COALESCE(b.total_usdt, 0.00) AS balance,
        COALESCE(b.available_usdt, 0.00) AS available_balance,
        COALESCE(b.spot_usdt, 0.00) AS spot_balance,
        COALESCE(b.futures_usdt, 0.00) AS futures_balance,
        COALESCE(b.staked_usdt, 0.00) AS staked_balance,
        k.kyc_id,
        k.full_name,
        k.id_number,
        k.document_type,
        k.country,
        k.submitted_at AS kyc_submitted_date,
        k.id_front_path,
        k.id_back_path
      FROM users u
      LEFT JOIN balances b ON b.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT id AS kyc_id, full_name, id_number, document_type, country, submitted_at, id_front_path, id_back_path
        FROM kyc_verifications
        WHERE user_id = u.id
        ORDER BY submitted_at DESC LIMIT 1
      ) k ON true
      WHERE 1=1
    `;

    const queryParams = [];

    if (search) {
      queryParams.push(`%${search}%`);
      sql += ` AND (
        LOWER(u.uid) LIKE LOWER($${queryParams.length}) OR
        LOWER(u.email) LIKE LOWER($${queryParams.length}) OR
        LOWER(u.username) LIKE LOWER($${queryParams.length})
      )`;
    }

    sql += ` ORDER BY u.created_at DESC;`;

    const result = await query(sql, queryParams);

    // Format user objects cleanly for Admin UI without password hashes
    const users = result.rows.map(row => {
      const kycStatusFormatted = row.kyc_status 
        ? row.kyc_status.charAt(0).toUpperCase() + row.kyc_status.slice(1).toLowerCase() 
        : 'Unverified';

      const accountStatusFormatted = row.status 
        ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase() 
        : 'Active';

      const formattedDate = row.created_at 
        ? new Date(row.created_at).toISOString().split('T')[0] 
        : 'N/A';

      const documentId = row.kyc_id || row.id;

      return {
        id: row.id,
        kycId: row.kyc_id || null,
        uid: row.uid,
        username: row.username,
        fullName: row.full_name || row.username,
        email: row.email,
        vipLevel: row.vip_level || 'VIP 1',
        balance: parseFloat(row.balance || 0),
        availableBalance: parseFloat(row.available_balance || 0),
        spotBalance: parseFloat(row.spot_balance || 0),
        referralCount: 0,
        kycStatus: kycStatusFormatted,
        status: accountStatusFormatted,
        country: row.country || 'Global',
        idNumber: row.id_number || 'N/A',
        documentType: row.document_type || 'National ID / Passport',
        ip: '127.0.0.1',
        submittedDate: row.kyc_submitted_date ? new Date(row.kyc_submitted_date).toISOString().split('T')[0] : formattedDate,
        createdAt: formattedDate,
        idFront: `/api/admin/kyc/document?id=${documentId}&userId=${row.id}&type=front`,
        idBack: `/api/admin/kyc/document?id=${documentId}&userId=${row.id}&type=back`,
      };
    });

    return NextResponse.json({
      success: true,
      users,
      totalCount: users.length
    });

  } catch (error) {
    console.error('Admin Users API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching admin users.' },
      { status: 500 }
    );
  }
}
