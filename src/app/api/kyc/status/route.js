import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || '';
    const email = searchParams.get('email') || '';

    if (!uid && !email) {
      return NextResponse.json(
        { success: false, error: 'User UID or Email parameter required' },
        { status: 400 }
      );
    }

    // Lookup user in PostgreSQL database using parameterized SQL query
    const userResult = await query(
      `SELECT id, uid, username, email, kyc_status 
       FROM users 
       WHERE (uid IS NOT NULL AND uid = $1) 
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2));`,
      [uid || 'NO_UID', email.toLowerCase() || 'NO_EMAIL']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        kycStatus: 'unverified',
        submission: null
      });
    }

    const user = userResult.rows[0];

    // Fetch latest KYC verification record
    const kycResult = await query(
      `SELECT id, full_name, id_number, country, document_type, status, submitted_at, reviewed_at 
       FROM kyc_verifications 
       WHERE user_id = $1 
       ORDER BY submitted_at DESC 
       LIMIT 1;`,
      [user.id]
    );

    const submission = kycResult.rows.length > 0 ? kycResult.rows[0] : null;

    return NextResponse.json({
      success: true,
      kycStatus: user.kyc_status || 'unverified',
      submission: submission ? {
        id: submission.id,
        fullName: submission.full_name,
        idNumber: submission.id_number,
        country: submission.country,
        documentType: submission.document_type,
        status: submission.status,
        submittedAt: submission.submitted_at,
        reviewedAt: submission.reviewed_at
      } : null
    });

  } catch (error) {
    console.error('KYC Status API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error checking KYC status.' },
      { status: 500 }
    );
  }
}
