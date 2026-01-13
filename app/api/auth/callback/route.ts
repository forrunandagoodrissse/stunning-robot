import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { exchangeCodeForTokens, getUserInfo } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${appUrl}/verify?error=${error}`);
  }
  
  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/verify?error=missing_params`);
  }
  
  try {
    const session = await getSession();
    
    if (state !== session.state) {
      console.error('State mismatch');
      return NextResponse.redirect(`${appUrl}/verify?error=state_mismatch`);
    }
    
    const codeVerifier = session.codeVerifier;
    if (!codeVerifier) {
      return NextResponse.redirect(`${appUrl}/verify?error=missing_verifier`);
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier);
    
    // Get full user info
    const userInfo = await getUserInfo(tokens.access_token);
    
    // Store in session
    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    session.user = userInfo;
    session.codeVerifier = undefined;
    session.state = undefined;
    
    await session.save();
    
    return NextResponse.redirect(appUrl);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${appUrl}/verify?error=callback_failed`);
  }
}
