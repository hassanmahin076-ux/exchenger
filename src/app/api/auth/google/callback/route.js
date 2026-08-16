import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/auth?error=google_login_failed', request.url));
  }

  // Redirect to dashboard with success message
  return NextResponse.redirect(new URL('/home?login=google_success', request.url));
}
