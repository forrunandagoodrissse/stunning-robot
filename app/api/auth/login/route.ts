import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRequestToken, buildAuthUrl } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Check env vars first
  if (!process.env.X_CLIENT_ID || !process.env.X_CLIENT_SECRET) {
    console.error('Missing X_CLIENT_ID or X_CLIENT_SECRET');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?error=missing_api_keys`
    );
  }

  try {
    const session = await getSession();
    
    // Step 1: Get request token
    const { oauth_token, oauth_token_secret } = await getRequestToken();
    
    // Store token secret in session for later
    session.oauthToken = oauth_token;
    session.oauthTokenSecret = oauth_token_secret;
    await session.save();
    
    // Step 2: Redirect to X authorization
    const authUrl = buildAuthUrl(oauth_token);
    
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error('Login error:', errorMessage);
    console.error('Full error:', error);
    
    // Return error details in response for debugging
    return NextResponse.json(
      { 
        error: 'login_failed', 
        detail: errorMessage,
        hint: 'Check X Developer Portal - OAuth 1.0a must be enabled and callback URL must match'
      },
      { status: 500 }
    );
  }
}
