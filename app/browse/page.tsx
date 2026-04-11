import type { Metadata } from 'next'
import BrowseClient from './BrowseClient'

export const metadata: Metadata = {
  title: 'Browse Products from UK Sellers | BigDiscounts',
  description: 'Discover thousands of products from independent UK sellers and small businesses. No buyer fees, direct contact with sellers. Browse by category, price and more.',
  alternates: { canonical: 'https://www.bigdiscounts.uk/browse' },
  openGraph: {
    title: 'Browse Products from UK Sellers | BigDiscounts',
    description: 'Discover products from independent UK sellers. No buyer fees, direct contact, competitive prices.',
    url: 'https://www.bigdiscounts.uk/browse',
    type: 'website',
  }
}

export default function BrowsePage() {
  return <BrowseClient />
}
