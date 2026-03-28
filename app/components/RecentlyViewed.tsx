'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  photo: string | null
}

// Call this on product page to track the view
export function TrackView({ product }: { product: Product }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bd_recently_viewed')
      const items: Product[] = stored ? JSON.parse(stored) : []
      // Remove if already exists
      const filtered = items.filter(p => p.id !== product.id)
      // Add to front
      const updated = [product, ...filtered].slice(0, 8)
      localStorage.setItem('bd_recently_viewed', JSON.stringify(updated))
    } catch {}
  }, [product.id])

  return null
}

// Show recently viewed on buyer dashboard
export function RecentlyViewedSection({ currency = '£' }: { currency?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bd_recently_viewed')
      if (stored) {
        setProducts(JSON.parse(stored).slice(0, 4))
      }
    } catch {}
    setTimeout(() => setVisible(true), 200)
  }, [])

  if (products.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-black text-white mb-6">🕐 Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <Link key={product.id} href={`/product/${product.id}`}
            className="rounded-2xl overflow-hidden group"
            style={{
              background: '#111111',
              border: '1px solid #222',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
            }}>
            <div className="h-32 overflow-hidden" style={{background: '#1a1a1a'}}>
              {product.photo ? (
                <img src={product.photo} alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105"
                  style={{transition: 'transform 0.3s ease'}} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
              )}
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-bold truncate">{product.title}</p>
              <p className="font-black text-sm mt-1" style={{color: '#fcd968'}}>
                {currency === '£' ? `£${product.price.toFixed(2)}` : `${product.price.toFixed(2)} RON`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
