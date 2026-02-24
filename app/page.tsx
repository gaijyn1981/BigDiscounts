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

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse</Link>
          
          
          {session?.user ? (
            <>
              <Link href="/seller/dashboard"
                className="text-gray-400 hover:text-white transition-colors text-sm">
                Hi, {session.user.name?.split(' ')[0]}
              </Link>
              <Link href="/seller/dashboard"
                className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm"
                style={{background: '#f59e0b', color: 'black'}}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link href="/register" style={{background: '#f59e0b'}} className="text-black px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="px-6 py-24 text-center" style={{background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-bold" style={{background: '#1a1400', border: '1px solid #f59e0b', color: '#f59e0b'}}>
            🇬🇧 The UK's Premium Discount Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Sell More.<br/>
            <span style={{color: '#f59e0b'}}>Pay Less.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            List your products for just £1/month. No hidden fees. No commissions. Connect directly with UK buyers today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {session?.user ? (
              <Link href="/seller/dashboard" style={{background: '#f59e0b'}}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/register?type=seller" style={{background: '#f59e0b'}}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                Start Selling — £1/mo
              </Link>
            )}
            <Link href="/browse"
              className="text-white px-8 py-4 rounded-xl font-black text-lg transition-colors"
              style={{background: '#1a1a1a', border: '1px solid #333'}}>
              Browse Deals
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12" style={{background: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a'}}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black" style={{color: '#f59e0b'}}>{totalProducts}+</p>
            <p className="text-gray-400 mt-1">Active Listings</p>
          </div>
          <div>
            <p className="text-4xl font-black" style={{color: '#f59e0b'}}>{totalSellers}+</p>
            <p className="text-gray-400 mt-1">UK Sellers</p>
          </div>
          <div>
            <p className="text-4xl font-black" style={{color: '#f59e0b'}}>£1</p>
            <p className="text-gray-400 mt-1">Per Month</p>
          </div>
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Latest Deals</h2>
              <Link href="/browse" style={{color: '#f59e0b'}} className="font-bold hover:opacity-80">View All →</Link>
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
                      <p className="text-2xl font-black" style={{color: '#f59e0b'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16" style={{background: '#111111'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-black text-white mb-2">1. List Your Product</h3>
              <p className="text-gray-400">Create your listing in minutes with photos, description and price.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #f59e0b'}}>
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-black text-white mb-2">2. Pay Just £1/mo</h3>
              <p className="text-gray-400">Activate your listing with our simple £1/month subscription.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black text-white mb-2">3. Connect & Sell</h3>
              <p className="text-gray-400">Buyers contact you directly. No middleman, no commission.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center" style={{background: '#0a0a0a'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start Selling?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join hundreds of UK sellers already using BigDiscounts.</p>
          {session?.user ? (
            <Link href="/seller/dashboard" style={{background: '#f59e0b'}}
              className="text-black px-10 py-4 rounded-xl font-black text-xl hover:opacity-90 transition-opacity inline-block">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/register?type=seller" style={{background: '#f59e0b'}}
              className="text-black px-10 py-4 rounded-xl font-black text-xl hover:opacity-90 transition-opacity inline-block">
              Start for £1/month
            </Link>
          )}
        </div>
      </section>

      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8 mb-8">
            <div>
              <p className="text-2xl font-black mb-2" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</p>
              <p className="text-gray-500 text-sm max-w-xs">The UK's premium discount marketplace. List products for just £1/month.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-white font-bold mb-3">Site</p>
                <div className="space-y-2">
                  <Link href="/browse" className="block text-gray-500 hover:text-white text-sm">Browse</Link>
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
            <p className="text-gray-700 text-xs mt-1">© 2026 BigDiscounts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
