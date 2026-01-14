import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { postTweet, refreshAccessToken } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Post text is required' }, { status: 400 });
    }

    if (text.length > 280) {
      return NextResponse.json({ error: 'Post exceeds 280 characters' }, { status: 400 });
    }

    try {
      const tweet = await postTweet(session.accessToken, text);
      return NextResponse.json({ success: true, tweet });
    } catch (error: any) {
      // Try refreshing token
      if (session.refreshToken) {
        try {
          const newTokens = await refreshAccessToken(session.refreshToken);
          session.accessToken = newTokens.access_token;
          session.refreshToken = newTokens.refresh_token;
          await session.save();

          const tweet = await postTweet(session.accessToken, text);
          return NextResponse.json({ success: true, tweet });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      console.error('Post error:', error);
      return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Post route error:', error);
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
  }
}
