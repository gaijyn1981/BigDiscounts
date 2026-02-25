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
        <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex gap-4 items-center">
          <Link href="/buyer/favourites" className="text-gray-400 hover:text-white transition-colors">❤️ Saved</Link>
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

      <div className="px-6 py-6" style={{background: '#111111', borderBottom: '1px solid #1a1a1a'}}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-white mb-4">Browse Deals 🔍</h1>
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl text-white focus:outline-none min-w-48"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl text-white focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Books">Books</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Health & Beauty">Health & Beauty</option>
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
            <p className="text-gray-500 text-lg">No products found.</p>
            <p className="text-gray-600 text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
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
                      🆕 New
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
                    <p className="text-gray-500 text-sm mb-2">{product.seller?.companyName}</p>
                    <p className="text-2xl font-black" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
