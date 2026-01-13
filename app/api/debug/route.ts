import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // List all env var names that start with X_ or contain API
  const allEnvKeys = Object.keys(process.env).filter(
    key => key.startsWith('X_') || key.includes('API') || key.includes('SECRET')
  );

  return NextResponse.json({
    hasApiKey: !!process.env.X_API_KEY,
    hasApiSecret: !!process.env.X_API_SECRET,
    hasSessionSecret: !!process.env.SESSION_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    apiKeyPrefix: process.env.X_API_KEY?.substring(0, 5) || 'NOT SET',
    relevantEnvVars: allEnvKeys,
  });
}
