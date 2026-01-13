import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { postTweet } from '@/lib/x-oauth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.accessToken || !session.accessTokenSecret) {
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
    
    const tweet = await postTweet(
      session.accessToken,
      session.accessTokenSecret,
      text
    );
    
    return NextResponse.json({ success: true, tweet });
  } catch (error: any) {
    console.error('Tweet error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post tweet' },
      { status: 500 }
    );
  }
}
