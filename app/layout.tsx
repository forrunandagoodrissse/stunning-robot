import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thread Composer',
  description: 'Compose and post X/Twitter threads with ease',
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
