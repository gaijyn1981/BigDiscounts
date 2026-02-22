'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  category: string
  photos: string
  createdAt: string
  seller: { companyName: string }
}

export default function BrowsePage() {
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
      if (sort === 'low') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      if (sort === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-blue-200 hover:text-white">Login</Link>
          <Link href="/buyer/favourites" className="text-blue-200 hover:text-white">❤️ Saved</Link>
          <Link href="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Sign Up</Link>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Browse Deals 🔍</h1>
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-w-48" />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sort by</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="new">Newest First</option>
            </select>
          </div>
          <div className="flex gap-3 mt-3 items-center">
            <span className="text-sm text-gray-500 font-semibold">Price range:</span>
            <input type="number" placeholder="Min £" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <span className="text-gray-400">to</span>
            <input type="number" placeholder="Max £" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            {(minPrice || maxPrice) && (
              <button onClick={() => { setMinPrice(''); setMaxPrice('') }}
                className="text-sm text-red-500 hover:underline">Clear</button>
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
            <p className="text-gray-400 text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => {
              const photos = JSON.parse(product.photos || '[]')
              const photo = photos[0]
              return (
                <Link key={product.id} href={`/product/${product.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group relative">
                  {isNew(product.createdAt) && (
                    <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-gray-900 text-xs font-black px-2 py-1 rounded-full uppercase">
                      🆕 New
                    </div>
                  )}
                  <div className="h-48 flex items-center justify-center overflow-hidden" style={{background: '#f0f4ff'}}>
                    {photo ? (
                      <img src={photo} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{product.category || 'General'}</span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.seller?.companyName}</p>
                    <p className="text-2xl font-black text-blue-700">£{product.price.toFixed(2)}</p>
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
