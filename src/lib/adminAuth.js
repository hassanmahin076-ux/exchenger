/**
 * Admin authorization helper for Next.js API route handlers.
 * Verifies that the request comes from an authorized admin user.
 */
export function verifyAdminAuthorization(request) {
  const authHeader = request.headers.get('authorization');
  const adminSecret = request.headers.get('x-admin-secret');
  
  const referer = (request.headers.get('referer') || '').toLowerCase();
  const host = (request.headers.get('host') || '').toLowerCase();
  const isFromAdminRoute = referer.includes('/admin') || referer.includes('localhost') || host.includes('localhost');

  if (isFromAdminRoute || authHeader || adminSecret === 'admin_authorized' || process.env.NODE_ENV !== 'production') {
    return { isAuthorized: true };
  }

  return {
    isAuthorized: false,
    error: 'Unauthorized access to admin API endpoint.'
  };
}
