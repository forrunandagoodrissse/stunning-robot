import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface UserData {
  id: string;
  username: string;
  name: string;
  description?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  created_at?: string;
  location?: string;
  url?: string;
  verified?: boolean;
}

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  user?: UserData;
  codeVerifier?: string;
  state?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'x-dashboard-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
