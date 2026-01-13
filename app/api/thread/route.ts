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
    
    const { tweets } = await request.json();
    
    if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
      return NextResponse.json({ error: 'No tweets provided' }, { status: 400 });
    }
    
    // Validate all tweets
    for (const tweet of tweets) {
      if (typeof tweet !== 'string' || tweet.trim().length === 0) {
        return NextResponse.json({ error: 'Invalid tweet content' }, { status: 400 });
      }
      if (tweet.length > 280) {
        return NextResponse.json({ error: 'Tweet exceeds 280 characters' }, { status: 400 });
      }
    }
    
    let accessToken = session.accessToken;
    const postedTweets: { id: string; text: string }[] = [];
    let lastTweetId: string | undefined;
    
    // Post thread sequentially
    for (let i = 0; i < tweets.length; i++) {
      try {
        const posted = await postTweet(accessToken, tweets[i], lastTweetId);
        postedTweets.push(posted);
        lastTweetId = posted.id;
      } catch (error: any) {
        // Try refreshing token on first failure
        if (i === 0 && session.refreshToken) {
          try {
            const newTokens = await refreshAccessToken(session.refreshToken);
            session.accessToken = newTokens.access_token;
            session.refreshToken = newTokens.refresh_token;
            await session.save();
            accessToken = newTokens.access_token;
            
            // Retry the tweet
            const posted = await postTweet(accessToken, tweets[i], lastTweetId);
            postedTweets.push(posted);
            lastTweetId = posted.id;
            continue;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        console.error(`Failed to post tweet ${i + 1}:`, error);
        return NextResponse.json({ 
          error: `Failed to post tweet ${i + 1}`,
          posted: postedTweets.length,
          detail: error.message
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      posted: postedTweets.length,
      tweets: postedTweets 
    });
  } catch (error) {
    console.error('Thread post error:', error);
    return NextResponse.json({ error: 'Failed to post thread' }, { status: 500 });
  }
}
