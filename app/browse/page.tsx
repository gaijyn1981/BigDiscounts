'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  category: string
  photos: string
  createdAt: string
  featured: boolean
  seller: { companyName: string }
}

export default function BrowsePage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }, [])

  function isNew(createdAt: string) {
    const created = new Date(createdAt)
    const now = new Date()
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays < 7
  }

  function isRecentlyAdded(createdAt: string) {
    const created = new Date(createdAt)
    const now = new Date()
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffHours < 24
  }

  const recentCount = products.filter(p => isRecentlyAdded(p.createdAt)).length

  const filtered = products
    .filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !category || p.category === category
      const matchMin = !minPrice || p.price >= parseFloat(minPrice)
      const matchMax = !maxPrice || p.price <= parseFloat(maxPrice)
      return matchSearch && matchCategory && matchMin && matchMax
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      if (sort === 'low') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      if (sort === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>BigDiscounts</span>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></Link>
          <Link href="/sell" className="text-gray-400 hover:text-white transition-colors">Sell</Link>
          {session ? (
            <>
              <Link href={session.user && (session.user as any).role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                className="text-gray-400 hover:text-white transition-colors text-sm">
                Hi, {session.user?.name?.split(' ')[0]}
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link href="/register" style={{background: '#fcd968'}} className="text-black px-5 py-2 rounded-lg font-bold hover:opacity-90">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="px-6 py-8" style={{background: '#111111', borderBottom: '1px solid #1a1a1a'}}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-2">Browse Products from Independent UK Sellers</h1>
          <p className="text-gray-500 text-sm mb-1">Discover products from independent UK sellers — direct, fair, and transparent.</p>
          {!loading && recentCount > 0 && (
            <p className="text-xs mb-4" style={{color: '#fcd968'}}>
              🆕 {recentCount} product{recentCount > 1 ? 's' : ''} added in the last 24 hours
            </p>
          )}
          {!loading && recentCount === 0 && (
            <p className="text-xs mb-4 text-gray-600">New products are added regularly — check back soon.</p>
          )}
          <div className="flex gap-3 flex-wrap mt-4">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl text-white focus:outline-none min-w-48"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl text-white focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}}>
              <option value="">All Categories</option>
              <option value="Electronics & Tech">Electronics & Tech</option>
              <option value="Phone & Accessories">Phone & Accessories</option>
              <option value="Clothing & Fashion">Clothing & Fashion</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Garden & Outdoor">Garden & Outdoor</option>
              <option value="Pets">Pets</option>
              <option value="Baby & Kids">Baby & Kids</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Books & Stationery">Books & Stationery</option>
              <option value="Tools & DIY">Tools & DIY</option>
              <option value="Automotive">Automotive</option>
              <option value="Arts & Crafts">Arts & Crafts</option>
              <option value="Office & Business">Office & Business</option>
              <option value="Gifts & Seasonal">Gifts & Seasonal</option>
              <option value="Cleaning & Household">Cleaning & Household</option>
              <option value="Other">Other</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-3 rounded-xl text-white focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}}>
              <option value="">Sort by</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="new">Newest First</option>
            </select>
          </div>
          <div className="flex gap-3 mt-3 items-center">
            <span className="text-sm font-semibold" style={{color: '#fcd968'}}>Price range:</span>
            <input type="number" placeholder="Min £" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
            <span className="text-gray-600">to</span>
            <input type="number" placeholder="Max £" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
            {(minPrice || maxPrice) && (
              <button onClick={() => { setMinPrice(''); setMaxPrice('') }}
                className="text-sm text-red-400 hover:text-red-300">Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-bold">No listings found here yet.</p>
            <p className="text-gray-600 text-sm mt-2">We are growing our selection — check back soon or explore other categories.</p>
            {category && (
              <button onClick={() => setCategory('')}
                className="mt-6 px-6 py-2 rounded-lg text-sm font-bold text-black hover:opacity-90"
                style={{background: '#fcd968'}}>
                View All Categories
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found{category ? ' in ' + category : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(product => {
                const photos = JSON.parse(product.photos || '[]')
                const photo = photos[0]
                return (
                  <Link key={product.id} href={`/product/${product.id}`}
                    className="rounded-2xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-200 relative"
                    style={{background: '#111111', border: product.featured ? '2px solid #fcd968' : '1px solid #222'}}>
                    {product.featured && (
                      <div className="absolute top-3 left-3 z-10 text-black text-xs font-black px-2 py-1 rounded-full"
                        style={{background: '#fcd968'}}>
                        ⭐ Featured
                      </div>
                    )}
                    {!product.featured && isNew(product.createdAt) && (
                      <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-black px-2 py-1 rounded-full">
                        New
                      </div>
                    )}
                    <div className="h-48 flex items-center justify-center overflow-hidden" style={{background: '#1a1a1a'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mt-1 mb-1 truncate">{product.title}</h3>
                      <p className="text-gray-500 text-xs mb-1">Sold by {product.seller?.companyName} — Direct Contact</p>
                      <p className="text-2xl font-black" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      <section className="px-6 py-14" style={{background: '#111111', borderTop: '1px solid #1a1a1a'}}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-4">Why Buy Direct from UK Sellers</h2>
          <p className="text-gray-500 leading-relaxed">
            Shopping on BigDiscounts allows buyers to discover products from independent UK sellers while supporting small businesses. By connecting directly with sellers, buyers benefit from transparent communication, competitive pricing, and a growing range of products across multiple categories.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '💬', text: 'Direct contact with sellers' },
              { icon: '🇬🇧', text: 'UK-based businesses' },
              { icon: '✅', text: 'No buyer fees, ever' },
            ].map(item => (
              <div key={item.text} className="p-4 rounded-xl flex items-center gap-3 justify-center" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
