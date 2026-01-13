import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thread Composer | Create X Threads Effortlessly',
  description: 'Compose, preview, and post multi-tweet threads to X (Twitter) with ease. A simple, beautiful tool for content creators.',
  keywords: ['Twitter', 'X', 'threads', 'tweet', 'social media', 'content creator', 'thread composer'],
  authors: [{ name: 'Thread Composer' }],
  openGraph: {
    title: 'Thread Composer',
    description: 'Create and post X threads effortlessly',
    type: 'website',
    siteName: 'Thread Composer',
  },
  twitter: {
    card: 'summary',
    title: 'Thread Composer',
    description: 'Create and post X threads effortlessly',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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
