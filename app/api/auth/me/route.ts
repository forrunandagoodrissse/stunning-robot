import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.accessToken || !session.userId) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({
      user: {
        id: session.userId,
        username: session.username,
        name: session.name,
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
