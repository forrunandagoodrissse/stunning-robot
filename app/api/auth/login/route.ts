import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRequestToken, buildAuthUrl } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET() {
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?error=login_failed`
    );
  }
}
