import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'dancecat',
  description: 'catcat',
  generator: 'cat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
