import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from './components/SessionProvider'
import CookieBanner from './components/CookieBanner'
import GoogleAnalytics from './components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BigDiscounts - The UK Discount Marketplace',
  description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month. No commission, no middleman.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <CookieBanner />
          <GoogleAnalytics />
        </SessionProvider>
      </body>
    </html>
  )
}
