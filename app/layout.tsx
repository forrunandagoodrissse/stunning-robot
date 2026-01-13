import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thread Composer | Write X Threads That Resonate',
  description: 'The simplest way to compose, preview, and publish multi-tweet threads to X. No distractions, just your words.',
  keywords: ['Twitter threads', 'X threads', 'tweet composer', 'thread writer', 'social media', 'content creator'],
  authors: [{ name: 'Thread Composer' }],
  openGraph: {
    title: 'Thread Composer',
    description: 'Write X threads that resonate. Compose, preview, and publish effortlessly.',
    type: 'website',
    siteName: 'Thread Composer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thread Composer',
    description: 'Write X threads that resonate',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
