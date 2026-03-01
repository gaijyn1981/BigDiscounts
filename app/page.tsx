import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UK Marketplace for Sellers | BigDiscounts — Fair, Low Fee Selling',
  description: 'BigDiscounts is a UK marketplace built to support sellers. List products for £1/month, keep 100% of every sale, and connect directly with buyers across the UK.',
}

export default async function Home() {
  const session = await getServerSession()

  const recentProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { seller: { select: { companyName: true } } }
  })

  const totalProducts = await prisma.product.count({ where: { active: true } })
  const totalSellers = await prisma.seller.count()

  const showCounters = totalSellers >= 50

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>BigDiscounts</span>
        <div className="flex gap-4 items-center">
          <Link href="/browse" aria-label="Browse products" className="text-gray-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></Link>
          <Link href="/sell" className="text-gray-400 hover:text-white transition-colors">Sell</Link>
          {session?.user ? (
            <>
              <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Hi, {session.user.name?.split(' ')[0]}
              </Link>
              <Link href="/seller/dashboard"
                className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm"
                style={{background: '#fcd968', color: 'black'}}>
                Dashboard
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
          )}
        </div>
      </nav>

      <section className="px-6 py-24 text-center" style={{background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-bold" style={{background: '#1a1400', border: '1px solid #fcd968', color: '#fcd968'}}>
            Connecting Buyers and Businesses Across the UK
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            The UK Marketplace<br/>
            <span style={{color: '#fcd968'}}>Built to Support Sellers</span>
          </h1>
          <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            A fair, transparent place to buy and sell — no commission, low fees, full control.
          </p>
          <p className="text-gray-600 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            BigDiscounts is an online marketplace in the United Kingdom designed to support independent sellers and small businesses. Unlike traditional platforms that charge commission on every sale, BigDiscounts offers a transparent £1/month listing fee with no commission, allowing sellers to keep 100% of their revenue while connecting directly with buyers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {session?.user ? (
              <Link href="/seller/dashboard" style={{background: '#fcd968'}}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/register?type=seller" style={{background: '#fcd968'}}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                Start Selling — £1/mo
              </Link>
            )}
            <Link href="/browse"
              className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity"
              style={{background: '#fcd968'}}>
              Browse Deals
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{background: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a'}}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">A Fair Alternative to High-Fee Marketplaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '💷', title: '£1/month listing fee', desc: 'No commission on any sale you make.' },
              { icon: '💰', title: 'Keep 100% of every sale', desc: 'Your revenue stays yours, always.' },
              { icon: '💬', title: 'Buyers contact you directly', desc: 'Full control over communication and fulfilment.' },
              { icon: '✅', title: 'Simple, transparent pricing', desc: 'No hidden costs, no contracts, cancel anytime.' },
            ].map(item => (
              <div key={item.title} className="p-5 rounded-xl text-center" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-white text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showCounters && (
        <section className="px-6 py-12" style={{background: '#0a0a0a', borderBottom: '1px solid #1a1a1a'}}>
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-black" style={{color: '#fcd968'}}>{totalProducts}+</p>
              <p className="text-gray-400 mt-1">Active Listings</p>
            </div>
            <div>
              <p className="text-4xl font-black" style={{color: '#fcd968'}}>{totalSellers}+</p>
              <p className="text-gray-400 mt-1">UK Sellers</p>
            </div>
            <div>
              <p className="text-4xl font-black" style={{color: '#fcd968'}}>£1</p>
              <p className="text-gray-400 mt-1">Per Month</p>
            </div>
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Latest Deals</h2>
              <Link href="/browse" style={{color: '#fcd968'}} className="font-bold hover:opacity-80">View All Deals →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentProducts.map(product => {
                const photos = JSON.parse(product.photos || '[]')
                const photo = photos[0]
                return (
                  <Link key={product.id} href={`/product/${product.id}`}
                    className="rounded-2xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-200"
                    style={{background: '#111111', border: '1px solid #222'}}>
                    <div className="h-48 flex items-center justify-center overflow-hidden" style={{background: '#1a1a1a'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate mb-1">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{product.seller.companyName}</p>
                      <p className="text-2xl font-black" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16" style={{background: '#111111'}}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">How Buying and Selling Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="p-8 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <p className="text-sm font-bold mb-6 inline-block px-3 py-1 rounded-full" style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>For Sellers</p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-black text-white mb-1">1. List your products</p>
                    <p className="text-gray-400 text-sm">Create your listing in minutes with photos, description and price.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-black text-white mb-1">2. Pay just £1/month</p>
                    <p className="text-gray-400 text-sm">Activate your listing with our simple £1/month subscription.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-black text-white mb-1">3. Keep 100% of every sale</p>
                    <p className="text-gray-400 text-sm">Buyers contact you directly. No commission, no middleman.</p>
                  </div>
                </div>
              </div>
              <Link href="/sell" className="inline-block mt-8 px-6 py-3 rounded-xl font-black text-black hover:opacity-90 transition-opacity" style={{background: '#fcd968'}}>
                Start Selling — £1/mo →
              </Link>
            </div>

            <div className="p-8 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <p className="text-sm font-bold mb-6 inline-block px-3 py-1 rounded-full" style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>For Buyers</p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-black text-white mb-1">1. Browse UK deals</p>
                    <p className="text-gray-400 text-sm">Discover products from UK sellers and businesses across all categories.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-black text-white mb-1">2. Contact sellers directly</p>
                    <p className="text-gray-400 text-sm">No middleman. Contact the seller directly and pay securely via PayPal.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-black text-white mb-1">3. No buyer fees, ever</p>
                    <p className="text-gray-400 text-sm">Free to browse and buy. No hidden charges, no platform fees.</p>
                  </div>
                </div>
              </div>
              <Link href="/browse" className="inline-block mt-8 px-6 py-3 rounded-xl font-black text-black hover:opacity-90 transition-opacity" style={{background: '#fcd968'}}>
                Browse Deals →
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Browse by Category</h2>
          <p className="text-gray-500 mb-10">Discover products from UK sellers across all categories.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { icon: '📱', label: 'Electronics & Tech', href: '/browse/Electronics%20%26%20Tech' },
              { icon: '📲', label: 'Phone & Accessories', href: '/browse/Phone%20%26%20Accessories' },
              { icon: '👗', label: 'Clothing & Fashion', href: '/browse/Clothing%20%26%20Fashion' },
              { icon: '🏠', label: 'Home & Living', href: '/browse/Home%20%26%20Living' },
              { icon: '🌿', label: 'Garden & Outdoor', href: '/browse/Garden%20%26%20Outdoor' },
              { icon: '🐾', label: 'Pets', href: '/browse/Pets' },
              { icon: '👶', label: 'Baby & Kids', href: '/browse/Baby%20%26%20Kids' },
              { icon: '💊', label: 'Health & Beauty', href: '/browse/Health%20%26%20Beauty' },
              { icon: '🧸', label: 'Toys & Games', href: '/browse/Toys%20%26%20Games' },
              { icon: '⚽', label: 'Sports & Fitness', href: '/browse/Sports%20%26%20Fitness' },
              { icon: '🍫', label: 'Food & Drink', href: '/browse/Food%20%26%20Drink' },
              { icon: '📚', label: 'Books & Stationery', href: '/browse/Books%20%26%20Stationery' },
              { icon: '🔧', label: 'Tools & DIY', href: '/browse/Tools%20%26%20DIY' },
              { icon: '🚗', label: 'Automotive', href: '/browse/Automotive' },
              { icon: '🎨', label: 'Arts & Crafts', href: '/browse/Arts%20%26%20Crafts' },
              { icon: '💼', label: 'Office & Business', href: '/browse/Office%20%26%20Business' },
              { icon: '🎁', label: 'Gifts & Seasonal', href: '/browse/Gifts%20%26%20Seasonal' },
              { icon: '🧹', label: 'Cleaning & Household', href: '/browse/Cleaning%20%26%20Household' },
              { icon: '📦', label: 'View All', href: '/browse' },
            ].map(item => (
              <Link key={item.label} href={item.href} className="p-4 rounded-xl text-center hover:opacity-80 transition-opacity" style={{background: '#111111', border: '1px solid #2a2a2a'}}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-gray-300 text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center" style={{background: '#111111'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            A Smarter Way to Buy and Sell in the UK.
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            BigDiscounts is a transparent marketplace where buyers and businesses connect directly — without unnecessary mark-ups or hidden barriers.
          </p>
          <div className="space-y-3 mb-12">
            <p className="text-white font-bold text-lg">Designed for fairness.</p>
            <p className="text-white font-bold text-lg">Built for visibility.</p>
            <p className="text-white font-bold text-lg">Grounded in trust.</p>
          </div>
          <p className="text-gray-500 text-base italic">
            A marketplace that puts people before platforms — always.
          </p>
        </div>
      </section>

      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8 mb-8">
            <div>
              <p className="text-2xl font-black mb-2" style={{color: '#fcd968'}}>BigDiscounts</p>
              <p className="text-gray-500 text-sm max-w-xs">Buy direct or sell for just £1/month. No commissions. No hidden fees.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-white font-bold mb-3">Site</p>
                <div className="space-y-2">
                  <Link href="/browse" className="block text-gray-500 hover:text-white text-sm">Browse</Link>
                  <Link href="/sell" className="block text-gray-500 hover:text-white text-sm">Start Selling</Link>
                  <Link href="/about" className="block text-gray-500 hover:text-white text-sm">About Us</Link>
                  <Link href="/contact" className="block text-gray-500 hover:text-white text-sm">Contact Us</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-bold mb-3">Categories</p>
                <div className="space-y-2">
                  <Link href="/browse/Electronics%20%26%20Tech" className="block text-gray-500 hover:text-white text-sm">Electronics & Tech</Link>
                  <Link href="/browse/Clothing%20%26%20Fashion" className="block text-gray-500 hover:text-white text-sm">Clothing & Fashion</Link>
                  <Link href="/browse/Home%20%26%20Living" className="block text-gray-500 hover:text-white text-sm">Home & Living</Link>
                  <Link href="/browse/Health%20%26%20Beauty" className="block text-gray-500 hover:text-white text-sm">Health & Beauty</Link>
                  <Link href="/browse/Garden%20%26%20Outdoor" className="block text-gray-500 hover:text-white text-sm">Garden & Outdoor</Link>
                  <Link href="/browse/Sports%20%26%20Fitness" className="block text-gray-500 hover:text-white text-sm">Sports & Fitness</Link>
                  <Link href="/browse/Toys%20%26%20Games" className="block text-gray-500 hover:text-white text-sm">Toys & Games</Link>
                  <Link href="/browse/Pets" className="block text-gray-500 hover:text-white text-sm">Pets</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-bold mb-3">Legal</p>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-gray-500 hover:text-white text-sm">Privacy Policy</Link>
                  <Link href="/terms" className="block text-gray-500 hover:text-white text-sm">Terms & Conditions</Link>
                  <Link href="/cookies" className="block text-gray-500 hover:text-white text-sm">Cookie Policy</Link>
                  <Link href="/data-request" className="block text-gray-500 hover:text-white text-sm">Data Request</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{borderTop: '1px solid #1a1a1a'}} className="pt-6 text-center">
            <p className="text-gray-600 text-sm">hello@bigdiscounts.uk</p>
            <p className="text-gray-600 text-xs mt-1">BigDiscounts is operated by Petrica Marin, Sole Trader, United Kingdom.</p>
            <p className="text-gray-700 text-xs mt-1">© 2026 BigDiscounts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
