'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Toast, useToast } from '@/app/components/Toast'

interface Product {
  id: string
  title: string
  price: number
  category: string
  active: boolean
  featured: boolean
  stripeSubId: string | null
  featuredSubId: string | null
  views: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const { toast, showToast, hideToast } = useToast()

  const success = searchParams.get('success')
  const cancelled = searchParams.get('cancelled')
  const featured = searchParams.get('featured')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchProducts()
  }, [status])

  async function fetchProducts() {
    const res = await fetch('/api/seller/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/seller/products/${id}`, { method: 'DELETE' })
    fetchProducts()
    showToast('Product deleted successfully', 'success')
  }

  async function activateProduct(id: string) {
    const res = await fetch('/api/stripe/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function featureProduct(id: string) {
    const res = await fetch('/api/stripe/feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  async function cancelSubscription(id: string, type: 'regular' | 'featured') {
    if (!confirm(`Cancel ${type} subscription? Your listing will be affected immediately.`)) return
    setCancelling(id + type)
    const res = await fetch('/api/stripe/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, type })
    })
    if (res.ok) {
      fetchProducts()
      showToast(`${type === 'featured' ? 'Featured' : ''} subscription cancelled`, 'info')
    } else {
      showToast('Failed to cancel. Please try again.', 'error')
    }
    setCancelling(null)
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#f59e0b'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Welcome, {session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-500 hover:text-red-400 transition-colors">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {success && (
          <div className="rounded-xl px-6 py-4 mb-6 flex items-center gap-3" style={{background: '#0a1a0a', border: '1px solid #4ade80'}}>
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-400">Payment successful!</p>
              <p className="text-green-600 text-sm">Your product is now active and visible to buyers.</p>
            </div>
          </div>
        )}

        {featured && (
          <div className="rounded-xl px-6 py-4 mb-6 flex items-center gap-3" style={{background: '#1a1400', border: '1px solid #f59e0b'}}>
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-bold" style={{color: '#f59e0b'}}>Listing featured successfully!</p>
              <p className="text-yellow-700 text-sm">Your product will appear at the top of the browse page.</p>
            </div>
          </div>
        )}

        {cancelled && (
          <div className="rounded-xl px-6 py-4 mb-6 flex items-center gap-3" style={{background: '#1a1000', border: '1px solid #f59e0b'}}>
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-yellow-400">Payment cancelled</p>
              <p className="text-yellow-700 text-sm">No changes were made to your listing.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white">My Products</h1>
          <div className="flex gap-3">
            <Link href="/seller/profile"
              className="px-6 py-3 rounded-lg font-bold transition-colors"
              style={{border: '1px solid #f59e0b', color: '#f59e0b'}}>
              Profile
            </Link>
            <Link href="/seller/products/new"
              className="px-6 py-3 rounded-lg font-bold text-black transition-opacity hover:opacity-90"
              style={{background: '#f59e0b'}}>
              + Add Product
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{background: '#111111', border: '1px solid #222'}}>
            <p className="text-gray-500 text-lg mb-4">You haven't listed any products yet.</p>
            <Link href="/seller/products/new"
              className="px-6 py-3 rounded-lg font-bold text-black"
              style={{background: '#f59e0b'}}>
              List Your First Product
            </Link>
          </div>
        ) : (
          <div className="rounded-xl p-4 mb-6" style={{background: '#1a1400', border: '1px solid #f59e0b'}}>
            <p className="font-bold mb-1" style={{color: '#f59e0b'}}>📦 Seller Responsibilities</p>
            <p className="text-gray-400 text-sm">As a seller you are responsible for: shipping products to buyers, accepting returns within 14 days under UK Consumer Contracts Regulations 2013, and issuing refunds where applicable. BigDiscounts is not liable for any disputes between buyers and sellers.</p>
          </div>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="rounded-xl p-6 flex justify-between items-center"
                style={{background: '#111111', border: product.featured ? '2px solid #f59e0b' : '1px solid #222'}}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg">{product.title}</h3>
                    {product.featured && (
                      <span className="text-xs font-black px-2 py-1 rounded-full text-black" style={{background: '#f59e0b'}}>⭐ Featured</span>
                    )}
                  </div>
                  <p className="text-gray-500">£{product.price.toFixed(2)} · {product.category || 'No category'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.active ? 'text-green-400' : 'text-yellow-400'}`}
                      style={{background: product.active ? '#0a1a0a' : '#1a1000', border: product.active ? '1px solid #4ade80' : '1px solid #f59e0b'}}>
                      {product.active ? 'Active' : 'Pending payment'}
                    </span>
                    <span className="text-sm text-gray-600">👁️ {product.views} views</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center flex-wrap justify-end">
                  {!product.active && (
                    <button onClick={() => activateProduct(product.id)}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-black hover:opacity-90"
                      style={{background: '#f59e0b'}}>
                      Activate £1/mo
                    </button>
                  )}
                  {product.active && !product.featured && (
                    <button onClick={() => featureProduct(product.id)}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-black hover:opacity-90"
                      style={{background: '#f59e0b'}}>
                      ⭐ Feature £3/mo
                    </button>
                  )}
                  {product.active && product.stripeSubId && (
                    <button onClick={() => cancelSubscription(product.id, 'regular')}
                      disabled={cancelling === product.id + 'regular'}
                      className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                      style={{background: '#1a0a0a', color: '#f87171', border: '1px solid #f87171'}}>
                      {cancelling === product.id + 'regular' ? 'Cancelling...' : 'Cancel Sub'}
                    </button>
                  )}
                  {product.featured && product.featuredSubId && (
                    <button onClick={() => cancelSubscription(product.id, 'featured')}
                      disabled={cancelling === product.id + 'featured'}
                      className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                      style={{background: '#1a1000', color: '#f59e0b', border: '1px solid #f59e0b'}}>
                      {cancelling === product.id + 'featured' ? 'Cancelling...' : 'Cancel Feature'}
                    </button>
                  )}
                  <Link href={`/seller/products/${product.id}/edit`} style={{color: '#f59e0b'}} className="hover:opacity-80 text-sm font-bold">Edit</Link>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-400 text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
