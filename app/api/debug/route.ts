import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // List ALL env var names  
  const allEnvKeys = Object.keys(process.env).sort();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.X_API_KEY,
    hasApiSecret: !!process.env.X_API_SECRET,
    apiKeyValue: process.env.X_API_KEY ? `${process.env.X_API_KEY.substring(0, 3)}...` : 'NOT SET',
    totalEnvVars: allEnvKeys.length,
    xVars: allEnvKeys.filter(k => k.startsWith('X_')),
  });
}
