import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Deals from UK Sellers | BigDiscounts Marketplace',
  description: 'Discover products from independent UK sellers. Browse categories including fashion, home, pets, and beauty on a fair and transparent UK marketplace.',
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
