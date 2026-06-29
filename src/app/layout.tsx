import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cardly — One tap. Your entire business.',
  description: 'NFC digital business cards for barbers, cafes, and every Malaysian business. Share, book, and get paid — all from one tap.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
