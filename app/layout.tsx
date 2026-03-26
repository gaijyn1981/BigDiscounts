import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import CookieBanner from './components/CookieBanner'
import GoogleAnalytics from './components/GoogleAnalytics'
import SchemaMarkup from './components/SchemaMarkup'
import NavbarWrapper from './components/NavbarWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bigdiscounts.uk'),
  title: 'BigDiscounts - The UK Discount Marketplace',
  description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month. No commission, no middleman.',
  keywords: 'UK marketplace, discount products, buy and sell UK, cheap products UK, online marketplace',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigDiscounts - The UK Discount Marketplace',
    description: 'Discover incredible deals from verified UK sellers. List your products for just £1/month. No commission, no middleman.',
    site: '@bigdiscounts_uk',
  },
  openGraph: {

    title: 'BigDiscounts - The UK Discount Marketplace',
    description: 'Discover amazing deals from verified UK sellers. List your products for just £1/month.',
    url: 'https://www.bigdiscounts.uk',
    siteName: 'BigDiscounts',
    locale: 'en_GB',
    type: 'website',
  },
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
          <NavbarWrapper />
          {children}
          <CookieBanner />
          <GoogleAnalytics />
          <SchemaMarkup />
        </Providers>
      </body>
    </html>
  )
}
