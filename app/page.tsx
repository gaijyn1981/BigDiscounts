import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

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
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</span>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="text-gray-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></Link>
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
            🇬🇧 Connecting Buyers and Businesses Across the UK.
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Thousands of UK Deals.<br/>
            <span style={{color: '#fcd968'}}>Buy direct. Sell for £1/month.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse thousands of UK deals and contact sellers directly — or list your own products for just £1/month with 0% commission.
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


      {showCounters && (
        <section className="px-6 py-12" style={{background: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a'}}>
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
              <Link href="/browse" style={{color: '#fcd968'}} className="font-bold hover:opacity-80">View All →</Link>
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
          <h2 className="text-3xl font-black text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* For Sellers */}
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

            {/* For Buyers */}
            <div className="p-8 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <p className="text-sm font-bold mb-6 inline-block px-3 py-1 rounded-full" style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>For Buyers</p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-black text-white mb-1">1. Browse UK deals</p>
                    <p className="text-gray-400 text-sm">Discover thousands of products from UK sellers and businesses.</p>
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

      <section className="px-6 py-24 text-center" style={{background: '#0a0a0a'}}>
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
              <p className="text-2xl font-black mb-2" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</p>
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
