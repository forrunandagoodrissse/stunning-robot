// X OAuth 1.0a implementation
import crypto from 'crypto';

const X_REQUEST_TOKEN_URL = 'https://api.x.com/oauth/request_token';
const X_AUTHORIZE_URL = 'https://api.x.com/oauth/authorize';
const X_ACCESS_TOKEN_URL = 'https://api.x.com/oauth/access_token';
const X_API_URL = 'https://api.x.com/2';

// Generate OAuth 1.0a nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Generate OAuth 1.0a timestamp
function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

// Percent encode for OAuth 1.0a
function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

// Generate OAuth 1.0a signature
function generateSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string = ''
): string {
  // Sort and encode parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams)
  ].join('&');

  // Create signing key
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  // Generate HMAC-SHA1 signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  return signature;
}

// Build OAuth 1.0a Authorization header
function buildAuthHeader(params: Record<string, string>): string {
  const headerParams = Object.keys(params)
    .filter(key => key.startsWith('oauth_'))
    .sort()
    .map(key => `${percentEncode(key)}="${percentEncode(params[key])}"`)
    .join(', ');

  return `OAuth ${headerParams}`;
}

// Step 1: Get request token
export async function getRequestToken(): Promise<{
  oauth_token: string;
  oauth_token_secret: string;
}> {
  const consumerKey = process.env.X_API_KEY!;
  const consumerSecret = process.env.X_API_SECRET!;
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  const oauthParams: Record<string, string> = {
    oauth_callback: callbackUrl,
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_version: '1.0',
  };

  // Generate signature
  oauthParams.oauth_signature = generateSignature(
    'POST',
    X_REQUEST_TOKEN_URL,
    oauthParams,
    consumerSecret
  );

  const response = await fetch(X_REQUEST_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': buildAuthHeader(oauthParams),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Request token error:', error);
    throw new Error('Failed to get request token');
  }

  const text = await response.text();
  const params = new URLSearchParams(text);

  return {
    oauth_token: params.get('oauth_token')!,
    oauth_token_secret: params.get('oauth_token_secret')!,
  };
}

// Step 2: Build authorization URL
export function buildAuthUrl(oauthToken: string): string {
  return `${X_AUTHORIZE_URL}?oauth_token=${oauthToken}`;
}

// Step 3: Exchange request token for access token
export async function getAccessToken(
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<{
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
}> {
  const consumerKey = process.env.X_API_KEY!;
  const consumerSecret = process.env.X_API_SECRET!;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    oauth_version: '1.0',
  };

  // Generate signature with token secret
  oauthParams.oauth_signature = generateSignature(
    'POST',
    X_ACCESS_TOKEN_URL,
    oauthParams,
    consumerSecret,
    oauthTokenSecret
  );

  const response = await fetch(X_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': buildAuthHeader(oauthParams),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Access token error:', error);
    throw new Error('Failed to get access token');
  }

  const text = await response.text();
  const params = new URLSearchParams(text);

  return {
    oauth_token: params.get('oauth_token')!,
    oauth_token_secret: params.get('oauth_token_secret')!,
    user_id: params.get('user_id')!,
    screen_name: params.get('screen_name')!,
  };
}

// Post a tweet using OAuth 1.0a
export async function postTweet(
  accessToken: string,
  accessTokenSecret: string,
  text: string
): Promise<{ id: string; text: string }> {
  const consumerKey = process.env.X_API_KEY!;
  const consumerSecret = process.env.X_API_SECRET!;
  const url = `${X_API_URL}/tweets`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  // Generate signature
  oauthParams.oauth_signature = generateSignature(
    'POST',
    url,
    oauthParams,
    consumerSecret,
    accessTokenSecret
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': buildAuthHeader(oauthParams),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Tweet post error:', error);
    throw new Error(error.detail || error.title || 'Failed to post tweet');
  }

  const data = await response.json();
  return data.data;
}

// Get user info
export async function getUserInfo(
  accessToken: string,
  accessTokenSecret: string
): Promise<{ id: string; username: string; name: string }> {
  const consumerKey = process.env.X_API_KEY!;
  const consumerSecret = process.env.X_API_SECRET!;
  const url = `${X_API_URL}/users/me`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: generateTimestamp(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  // Generate signature
  oauthParams.oauth_signature = generateSignature(
    'GET',
    url,
    oauthParams,
    consumerSecret,
    accessTokenSecret
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': buildAuthHeader(oauthParams),
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
