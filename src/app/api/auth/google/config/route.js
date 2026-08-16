import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  return NextResponse.json({
    success: true,
    clientId: clientId.trim(),
    isConfigured: Boolean(
      clientId && 
      !clientId.includes('your_google_client_id') && 
      !clientId.includes('your-google-client-id') &&
      !clientId.startsWith('your_') &&
      !clientId.startsWith('your-')
    )
  });
}
