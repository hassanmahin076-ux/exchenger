import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();

    // Query all KYC submissions joined with user details and balances
    const kycResult = await query(
      `SELECT 
        k.id AS kyc_id,
        k.user_id,
        u.uid,
        u.username,
        u.email,
        u.status AS user_account_status,
        k.full_name,
        k.id_number,
        k.country,
        k.document_type,
        k.id_front_path,
        k.id_back_path,
        k.status AS kyc_status,
        k.submitted_at,
        k.reviewed_at,
        COALESCE(b.total_usdt, 0.00) AS balance
       FROM kyc_verifications k
       JOIN users u ON k.user_id = u.id
       LEFT JOIN balances b ON b.user_id = u.id
       ORDER BY k.submitted_at DESC;`
    );

    // Also query overall users list for Admin Panel overview tables
    const usersResult = await query(
      `SELECT 
        u.id,
        u.uid,
        u.username,
        u.email,
        u.kyc_status,
        u.status AS account_status,
        u.created_at,
        COALESCE(b.total_usdt, 0.00) AS balance
       FROM users u
       LEFT JOIN balances b ON b.user_id = u.id
       ORDER BY u.created_at DESC;`
    );

    // Map KYC verifications to Admin Panel format
    const kycList = kycResult.rows.map(row => {
      // Map status case (e.g. 'pending' -> 'Pending', 'verified' -> 'Verified', 'rejected' -> 'Rejected')
      let statusFormatted = 'Pending';
      if (row.kyc_status?.toLowerCase() === 'verified') statusFormatted = 'Verified';
      if (row.kyc_status?.toLowerCase() === 'rejected') statusFormatted = 'Rejected';

      const submittedDateStr = row.submitted_at 
        ? new Date(row.submitted_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        kycId: row.kyc_id,
        uid: row.uid,
        username: row.full_name || row.username,
        email: row.email || 'N/A',
        country: row.country || 'N/A',
        idNumber: row.id_number || 'N/A',
        documentType: row.document_type || 'ID card',
        balance: parseFloat(row.balance || 0),
        kycStatus: statusFormatted,
        status: row.user_account_status === 'frozen' ? 'Frozen' : 'Active',
        submittedDate: submittedDateStr,
        submittedAtRaw: row.submitted_at,
        idFront: row.id_front_path ? `/api/admin/kyc/document?id=${row.kyc_id}&type=front` : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
        idBack: row.id_back_path ? `/api/admin/kyc/document?id=${row.kyc_id}&type=back` : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      };
    });

    const allUsers = usersResult.rows.map(row => {
      let statusFormatted = 'Unverified';
      if (row.kyc_status?.toLowerCase() === 'verified') statusFormatted = 'Verified';
      if (row.kyc_status?.toLowerCase() === 'pending') statusFormatted = 'Pending';
      if (row.kyc_status?.toLowerCase() === 'rejected') statusFormatted = 'Rejected';

      return {
        uid: row.uid,
        username: row.username,
        email: row.email || 'N/A',
        balance: parseFloat(row.balance || 0),
        kycStatus: statusFormatted,
        status: row.account_status === 'frozen' ? 'Frozen' : 'Active',
      };
    });

    return NextResponse.json({
      success: true,
      kycSubmissions: kycList,
      allUsers: allUsers,
      counts: {
        pending: kycList.filter(k => k.kycStatus === 'Pending').length,
        verified: kycList.filter(k => k.kycStatus === 'Verified').length,
        rejected: kycList.filter(k => k.kycStatus === 'Rejected').length,
      }
    });

  } catch (error) {
    console.error('Admin KYC API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching admin KYC list.' },
      { status: 500 }
    );
  }
}
