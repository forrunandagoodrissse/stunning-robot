import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TweetForge | AI Tweet Generator',
  description: 'Generate viral tweets with AI. Enter your idea, pick a tone, and post directly to X.',
  keywords: ['AI tweets', 'tweet generator', 'X', 'Twitter', 'social media AI', 'viral tweets'],
  authors: [{ name: 'TweetForge' }],
  openGraph: {
    title: 'TweetForge — AI Tweet Generator',
    description: 'Generate tweets that go viral. AI-powered, direct posting to X.',
    type: 'website',
    siteName: 'TweetForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TweetForge',
    description: 'Generate viral tweets with AI',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
