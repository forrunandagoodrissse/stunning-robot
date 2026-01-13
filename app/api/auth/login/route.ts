import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { buildAuthUrl, generateCodeVerifier, generateState } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Check env vars first
  if (!process.env.X_CLIENT_ID || !process.env.X_CLIENT_SECRET) {
    console.error('Missing X_CLIENT_ID or X_CLIENT_SECRET');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify?error=missing_credentials`
    );
  }

  try {
    const session = await getSession();
    
    // Generate PKCE code verifier and state
    const codeVerifier = generateCodeVerifier();
    const state = generateState();
    
    // Store in session for verification later
    session.codeVerifier = codeVerifier;
    session.state = state;
    await session.save();
    
    // Build and redirect to X authorization URL
    const authUrl = await buildAuthUrl(codeVerifier, state);
    
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Login error:', error?.message || error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify?error=login_failed`
    );
  }
}
