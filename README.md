# Chirp - X Post App

A sleek web application to compose and post tweets to X/Twitter using OAuth 2.0 authentication with the `tweet.write` scope.

![Chirp App](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)

## Features

- 🔐 **Secure OAuth 2.0 with PKCE** - Industry-standard authentication flow
- ✍️ **Tweet Composer** - Write and post tweets with a character counter
- 🎨 **Modern Dark UI** - Beautiful, responsive design
- ⚡ **Serverless Ready** - Optimized for Vercel deployment
- 🔄 **Token Refresh** - Automatic token refresh for uninterrupted sessions

## Setup

### 1. Create X Developer App

1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/projects-and-apps)
2. Create a new project and app
3. Enable **OAuth 2.0** under "User authentication settings"
4. Set the following:
   - **App permissions**: Read and write
   - **Type of App**: Web App
   - **Callback URL**: `https://your-domain.vercel.app/api/auth/callback` (or `http://localhost:3000/api/auth/callback` for local dev)
   - **Website URL**: Your app's URL
5. Copy your **Client ID** and **Client Secret**

### 2. Environment Variables

Copy `env.example.txt` to `.env.local` and fill in your values:

```bash
# X/Twitter OAuth 2.0 Credentials
X_CLIENT_ID=your_client_id_here
X_CLIENT_SECRET=your_client_secret_here

# Session encryption secret (generate a random 32+ character string)
SESSION_SECRET=your_super_secret_session_key_here_32_chars_min

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/x-post-app)

### Manual Deploy

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `X_CLIENT_ID`
   - `X_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g., `https://your-app.vercel.app`)
4. Update your X Developer App callback URL to match your Vercel domain

## OAuth Scopes

This app requests the following scopes:
- `tweet.read` - Read tweets
- `tweet.write` - Post tweets
- `users.read` - Read user profile
- `offline.access` - Refresh tokens

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: OAuth 2.0 with PKCE
- **Session**: iron-session
- **Styling**: CSS (no dependencies)
- **Deployment**: Vercel

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | GET | Initiates OAuth flow |
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/auth/logout` | POST | Clears session |
| `/api/auth/me` | GET | Returns current user |
| `/api/tweet` | POST | Posts a tweet |

## License

MIT
