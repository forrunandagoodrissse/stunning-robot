// X OAuth 2.0 with PKCE implementation

const X_AUTH_URL = 'https://x.com/i/oauth2/authorize';
const X_TOKEN_URL = 'https://api.x.com/2/oauth2/token';
const X_API_URL = 'https://api.x.com/2';

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

export function generateCodeVerifier(): string {
  return generateRandomString(64);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  const bytes = new Uint8Array(digest);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function generateState(): string {
  return generateRandomString(32);
}

// Build authorization URL with write scopes
export async function buildAuthUrl(
  codeVerifier: string,
  state: string
): Promise<string> {
  const clientId = process.env.X_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  
  return `${X_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<{ access_token: string; refresh_token: string }> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(X_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange error:', error);
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }
  
  return response.json();
}

export async function getUserInfo(accessToken: string): Promise<{
  id: string;
  username: string;
  name: string;
}> {
  const response = await fetch(`${X_API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('User info error:', error);
    throw new Error('Failed to fetch user info');
  }
  
  const data = await response.json();
  return data.data;
}

// Post a tweet, optionally as a reply
export async function postTweet(
  accessToken: string, 
  text: string,
  replyToId?: string
): Promise<{ id: string; text: string }> {
  const body: { text: string; reply?: { in_reply_to_tweet_id: string } } = { text };
  
  if (replyToId) {
    body.reply = { in_reply_to_tweet_id: replyToId };
  }
  
  const response = await fetch(`${X_API_URL}/tweets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Post tweet error:', error);
    throw new Error(`Failed to post tweet: ${error}`);
  }
  
  const data = await response.json();
  return data.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(X_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }
  
  return response.json();
}
