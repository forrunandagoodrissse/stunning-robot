import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PostForge | AI Post Generator for X',
  description: 'Generate viral posts with AI. Enter your idea, pick a tone, and post directly to X.',
  keywords: ['AI posts', 'post generator', 'X', 'social media AI', 'viral posts'],
  authors: [{ name: 'PostForge' }],
  openGraph: {
    title: 'PostForge — AI Post Generator',
    description: 'Generate posts that go viral. AI-powered, direct posting to X.',
    type: 'website',
    siteName: 'PostForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostForge',
    description: 'Generate viral posts with AI',
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
