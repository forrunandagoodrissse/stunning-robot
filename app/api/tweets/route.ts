import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserTweets, refreshAccessToken } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.accessToken || !session.user) {
      return NextResponse.json({ tweets: [] }, { status: 401 });
    }
    
    try {
      const tweets = await getUserTweets(session.accessToken, session.user.id);
      return NextResponse.json({ tweets });
    } catch (error: any) {
      // Try refreshing token
      if (session.refreshToken) {
        try {
          const newTokens = await refreshAccessToken(session.refreshToken);
          session.accessToken = newTokens.access_token;
          session.refreshToken = newTokens.refresh_token;
          await session.save();
          
          const tweets = await getUserTweets(session.accessToken, session.user.id);
          return NextResponse.json({ tweets });
        } catch (refreshError) {
          console.error('Refresh failed:', refreshError);
        }
      }
      
      console.error('Tweets error:', error);
      return NextResponse.json({ tweets: [] });
    }
  } catch (error) {
    console.error('Tweets route error:', error);
    return NextResponse.json({ tweets: [] });
  }
}
