'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// Hook for detecting when element is in viewport
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

// Counter animation hook
function useCounter(target: number, inView: boolean, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView || target === 0) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

interface Props {
  session: boolean
  recentProducts: {
    id: string
    title: string
    price: number
    photos: string
    category: string | null
    seller: { companyName: string }
  }[]
  totalProducts: number
  totalSellers: number
  showCounters: boolean
}

export default function AnimatedHome({ session, recentProducts, totalProducts, totalSellers, showCounters }: Props) {
  // Hero fade-in
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Stats counter
  const { ref: statsRef, inView: statsInView } = useInView()
  const productCount = useCounter(totalProducts, statsInView)
  const sellerCount = useCounter(totalSellers, statsInView)

  // Products scroll animation
  const { ref: productsRef, inView: productsInView } = useInView(0.05)

  // Categories scroll animation
  const { ref: categoriesRef, inView: categoriesInView } = useInView(0.05)

  const categories = [
    { icon: '📱', label: 'Electronics & Tech', href: '/browse/Electronics%20%26%20Tech' },
    { icon: '👕', label: 'Clothing & Fashion', href: '/browse/Clothing%20%26%20Fashion' },
    { icon: '🏠', label: 'Home & Living', href: '/browse/Home%20%26%20Living' },
    { icon: '🌿', label: 'Garden & Outdoor', href: '/browse/Garden%20%26%20Outdoor' },
    { icon: '🐾', label: 'Pets', href: '/browse/Pets' },
    { icon: '👶', label: 'Baby & Kids', href: '/browse/Baby%20%26%20Kids' },
    { icon: '💄', label: 'Health & Beauty', href: '/browse/Health%20%26%20Beauty' },
    { icon: '🎮', label: 'Toys & Games', href: '/browse/Toys%20%26%20Games' },
    { icon: '⚽', label: 'Sports & Fitness', href: '/browse/Sports%20%26%20Fitness' },
    { icon: '🍕', label: 'Food & Drink', href: '/browse/Food%20%26%20Drink' },
    { icon: '📚', label: 'Books & Stationery', href: '/browse/Books%20%26%20Stationery' },
    { icon: '🔧', label: 'Tools & DIY', href: '/browse/Tools%20%26%20DIY' },
    { icon: '🚗', label: 'Automotive', href: '/browse/Automotive' },
    { icon: '🎨', label: 'Arts & Crafts', href: '/browse/Arts%20%26%20Crafts' },
    { icon: '🎁', label: 'Gifts & Seasonal', href: '/browse/Gifts%20%26%20Seasonal' },
    { icon: '🧹', label: 'Cleaning & Household', href: '/browse/Cleaning%20%26%20Household' },
    { icon: '📦', label: 'Other', href: '/browse/Other' },
  ]

  return (
    <>
      {/* Hero Section - Fade in */}
      <section className="px-6 py-24 text-center" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
        <div
          className="max-w-4xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-bold" style={{ background: '#1a1400', border: '1px solid #fcd968', color: '#fcd968' }}>
            Connecting Buyers and Businesses Across the UK
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            The UK Marketplace<br />
            <span style={{ color: '#fcd968' }}>Built to Support Sellers and Buyers</span>
          </h1>
          <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            A fair, transparent place to buy and sell — no commission, low fees, full control.
          </p>
          <p className="text-gray-600 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            BigDiscounts is an online marketplace in the United Kingdom designed to support independent sellers and small businesses. Unlike traditional platforms that charge commission on every sale, BigDiscounts offers a transparent £1/month listing fee with no commission, allowing sellers to keep 100% of their revenue while connecting directly with buyers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {session ? (
              <Link href="/seller/dashboard" style={{ background: '#fcd968' }}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/register?type=seller" style={{ background: '#fcd968' }}
                className="text-black px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform duration-200 inline-block">
                Start Selling — £1/mo
              </Link>
            )}
            <Link href="/browse"
              className="text-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-opacity"
              style={{ background: '#fcd968' }}>
              Browse Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      {showCounters && (
        <div ref={statsRef} className="px-6 py-10" style={{ background: '#111111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6 text-center">
            <div>
              <p
                className="text-4xl font-black"
                style={{
                  color: '#fcd968',
                  transition: 'all 0.3s ease',
                }}
              >
                {sellerCount}+
              </p>
              <p className="text-gray-400 text-sm mt-1">Sellers</p>
            </div>
            <div>
              <p
                className="text-4xl font-black"
                style={{ color: '#fcd968' }}
              >
                {productCount}+
              </p>
              <p className="text-gray-400 text-sm mt-1">Products</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section - Staggered slide in */}
      <section className="px-6 py-14" style={{ background: '#0a0a0a' }}>
        <h2 className="text-2xl font-black text-white text-center mb-8">Browse by Category</h2>
        <div ref={categoriesRef} className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center p-3 rounded-xl text-center group"
              style={{
                background: '#111111',
                border: '1px solid #222',
                opacity: categoriesInView ? 1 : 0,
                transform: categoriesInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`,
              }}
            >
              <span
                className="text-2xl mb-1 group-hover:scale-125 inline-block"
                style={{ transition: 'transform 0.2s ease' }}
              >
                {cat.icon}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-white" style={{ transition: 'color 0.2s ease' }}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Products - Staggered fade in */}
      {recentProducts.length > 0 && (
        <section className="px-6 py-14" style={{ background: '#111111' }}>
          <h2 className="text-2xl font-black text-white text-center mb-8">Latest Listings</h2>
          <div ref={productsRef} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map((product, i) => {
              const photos = JSON.parse(product.photos || '[]')
              const photo = photos[0] || null
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="rounded-xl overflow-hidden group"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #222',
                    opacity: productsInView ? 1 : 0,
                    transform: productsInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
                    transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
                  }}
                >
                  <div
                    className="h-40 overflow-hidden"
                    style={{ background: '#222' }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105"
                        style={{ transition: 'transform 0.3s ease' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-bold truncate">{product.title}</p>
                    <p className="text-xs text-gray-500 truncate">{product.seller.companyName}</p>
                    <p className="font-black mt-1" style={{ color: '#fcd968' }}>£{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse" style={{ background: '#fcd968' }}
              className="text-black px-8 py-3 rounded-xl font-black hover:opacity-90 transition-opacity inline-block">
              View All Listings
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
