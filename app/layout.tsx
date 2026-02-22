import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import CookieBanner from './components/CookieBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BigDiscounts - The UK Discount Marketplace',
  description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month. No commission, no middleman.',
  keywords: 'UK marketplace, discount products, buy and sell UK, cheap products UK, online marketplace',
  openGraph: {
    title: 'BigDiscounts - The UK Discount Marketplace',
    description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month.',
    url: 'https://www.bigdiscounts.uk',
    siteName: 'BigDiscounts',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigDiscounts - The UK Discount Marketplace',
    description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.bigdiscounts.uk',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}
