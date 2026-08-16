import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('auth_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, isLoggedIn: false, error: 'No active session.' },
        { status: 401 }
      );
    }

    let sessionData = null;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch (e) {
      return NextResponse.json(
        { success: false, isLoggedIn: false, error: 'Invalid session payload.' },
        { status: 401 }
      );
    }

    if (!sessionData || !sessionData.userId) {
      return NextResponse.json(
        { success: false, isLoggedIn: false, error: 'Invalid session user.' },
        { status: 401 }
      );
    }

    // Query user from PostgreSQL database to get fresh status
    const userQuery = await query(
      `SELECT id, uid, username, email, google_id, avatar_url, vip_level, kyc_status, status, auth_provider
       FROM users
       WHERE id = $1;`,
      [sessionData.userId]
    );

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { success: false, isLoggedIn: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    const user = userQuery.rows[0];

    if (user.status && user.status !== 'active') {
      return NextResponse.json(
        { success: false, isLoggedIn: false, error: 'User account is deactivated.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user: {
        id: user.id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatar_url,
        vipLevel: user.vip_level,
        kycStatus: user.kyc_status,
        authProvider: user.auth_provider,
      },
    });

  } catch (error) {
    console.error('Session Check API Error:', error);
    return NextResponse.json(
      { success: false, isLoggedIn: false, error: 'Failed to verify session.' },
      { status: 500 }
    );
  }
}
