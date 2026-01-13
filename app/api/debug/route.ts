import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    hasClientId: !!process.env.X_CLIENT_ID,
    hasClientSecret: !!process.env.X_CLIENT_SECRET,
    hasSessionSecret: !!process.env.SESSION_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    clientIdPrefix: process.env.X_CLIENT_ID?.substring(0, 8) || 'NOT SET',
  });
}
