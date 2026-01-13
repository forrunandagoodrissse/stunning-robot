import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { postTweet, refreshAccessToken } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Tweet text is required' },
        { status: 400 }
      );
    }
    
    if (text.length > 280) {
      return NextResponse.json(
        { error: 'Tweet exceeds 280 characters' },
        { status: 400 }
      );
    }
    
    try {
      const tweet = await postTweet(session.accessToken, text);
      return NextResponse.json({ success: true, tweet });
    } catch (error: any) {
      // If token expired, try to refresh
      if (error.message.includes('401') && session.refreshToken) {
        try {
          const newTokens = await refreshAccessToken(session.refreshToken);
          session.accessToken = newTokens.access_token;
          session.refreshToken = newTokens.refresh_token;
          await session.save();
          
          // Retry with new token
          const tweet = await postTweet(session.accessToken, text);
          return NextResponse.json({ success: true, tweet });
        } catch (refreshError) {
          // Refresh failed, user needs to re-authenticate
          session.destroy();
          return NextResponse.json(
            { error: 'Session expired. Please log in again.' },
            { status: 401 }
          );
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Tweet error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post tweet' },
      { status: 500 }
    );
  }
}
