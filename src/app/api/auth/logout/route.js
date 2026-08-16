import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully!',
    });

    // Clear HTTP-only session cookie
    response.cookies.set({
      name: 'auth_session',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log out properly.' },
      { status: 500 }
    );
  }
}
