'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  category: string
  photos: string
  seller: { companyName: string }
}

export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !category || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">💰 BigDiscounts</Link>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-blue-200 hover:text-white">Login</Link>
          <Link href="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Sign Up</Link>
        </div>
      </nav>

      {/* Compact search bar - not full blue hero */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Browse Deals 🔍</h1>
          <div className="flex gap-3">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
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
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
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
