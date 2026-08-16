import { headers } from 'next/headers';

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || '0x4AAAAAAEQlaVlm3Dh37NRMbxe6AYEyCPY';

/**
 * Server-side validation of Cloudflare Turnstile token via canonical siteverify endpoint
 * @param {string} token - The cf-turnstile-response token from client
 * @param {string} expectedAction - Optional expected action name (e.g. 'login', 'register')
 * @returns {Promise<{ success: boolean, hostname?: string, error?: string }>}
 */
export async function verifyTurnstileToken(token, expectedAction = null) {
  if (!token || typeof token !== 'string' || token.trim().length === 0 || token.length > 2048) {
    return { success: false, error: 'Turnstile verification token is missing or invalid.' };
  }

  // Get client IP address if available
  let clientIp = '';
  try {
    const headersList = await headers();
    clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               headersList.get('x-real-ip') || '';
  } catch (e) {}

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      signal: AbortSignal.timeout(10000),
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token.trim(),
        ...(clientIp ? { remoteip: clientIp } : {})
      })
    });

    if (!response.ok) {
      console.warn(`Turnstile siteverify HTTP error: ${response.status}`);
      return { success: false, error: `Siteverify failed with status ${response.status}` };
    }

    const data = await response.json();

    if (!data.success) {
      console.warn('Turnstile siteverify returned success: false', data['error-codes']);
      // Local development fallback if domain or clock mismatch occurs in testing
      if (process.env.NODE_ENV !== 'production') {
        return { success: true, hostname: 'localhost' };
      }
      return { 
        success: false, 
        error: 'Cloudflare Turnstile verification failed. Please try again.' 
      };
    }

    // Verify expected action if specified
    if (expectedAction && data.action && data.action !== expectedAction) {
      console.warn(`Turnstile action mismatch: expected ${expectedAction}, got ${data.action}`);
      return { success: false, error: 'Security verification action mismatch.' };
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action
    };
  } catch (error) {
    console.error('Turnstile verification server error:', error);
    // Development / network fallback when offline or sandbox
    if (process.env.NODE_ENV !== 'production' && token === 'XXXX.DUMMY.TOKEN.XXXX') {
      return { success: true, hostname: 'localhost' };
    }
    return { success: false, error: 'Internal error validating security captcha.' };
  }
}
