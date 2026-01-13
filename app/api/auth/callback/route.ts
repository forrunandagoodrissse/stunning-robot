import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAccessToken, getUserInfo } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauthToken = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');
  const denied = searchParams.get('denied');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // User denied access
  if (denied) {
    return NextResponse.redirect(`${appUrl}?error=access_denied`);
  }
  
  if (!oauthToken || !oauthVerifier) {
    return NextResponse.redirect(`${appUrl}?error=missing_params`);
  }
  
  try {
    const session = await getSession();
    
    // Verify oauth_token matches
    if (oauthToken !== session.oauthToken) {
      console.error('OAuth token mismatch');
      return NextResponse.redirect(`${appUrl}?error=token_mismatch`);
    }
    
    const oauthTokenSecret = session.oauthTokenSecret;
    if (!oauthTokenSecret) {
      return NextResponse.redirect(`${appUrl}?error=missing_token_secret`);
    }
    
    // Step 3: Exchange for access token
    const accessData = await getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    );
    
    // Get user info
    let userInfo;
    try {
      userInfo = await getUserInfo(accessData.oauth_token, accessData.oauth_token_secret);
    } catch {
      // Fallback to screen_name from access token response
      userInfo = {
        id: accessData.user_id,
        username: accessData.screen_name,
        name: accessData.screen_name,
      };
    }
    
    // Store in session
    session.accessToken = accessData.oauth_token;
    session.accessTokenSecret = accessData.oauth_token_secret;
    session.userId = userInfo.id;
    session.username = userInfo.username;
    session.name = userInfo.name;
    
    // Clear temporary tokens
    session.oauthToken = undefined;
    session.oauthTokenSecret = undefined;
    
    await session.save();
    
    return NextResponse.redirect(appUrl);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${appUrl}?error=callback_failed`);
  }
}
