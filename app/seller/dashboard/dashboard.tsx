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

  if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">🇬🇧 BigDiscounts</Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-600 hover:text-red-500">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-800">Payment successful!</p>
              <p className="text-green-600 text-sm">Your product is now active and visible to buyers.</p>
            </div>
          </div>
        )}

        {featured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-bold text-yellow-800">Listing featured successfully!</p>
              <p className="text-yellow-600 text-sm">Your product will appear at the top of the browse page.</p>
            </div>
          </div>
        )}

        {cancelled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-yellow-800">Payment cancelled</p>
              <p className="text-yellow-600 text-sm">No changes were made to your listing.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <div className="flex gap-3">
            <Link href="/seller/profile" className="text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">Profile</Link>
            <Link href="/seller/products/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">+ Add Product</Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500 text-lg mb-4">You haven't listed any products yet.</p>
            <Link href="/seller/products/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">List Your First Product</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className={`bg-white rounded-xl p-6 shadow-sm flex justify-between items-center ${product.featured ? 'border-2 border-yellow-400' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    {product.featured && <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold">⭐ Featured</span>}
                  </div>
                  <p className="text-gray-500">£{product.price.toFixed(2)} · {product.category || 'No category'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-sm px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {product.active ? 'Active' : 'Pending payment'}
                    </span>
                    <span className="text-sm text-gray-400">👁️ {product.views} views</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center flex-wrap justify-end">
                  {!product.active && (
                    <button onClick={() => activateProduct(product.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                      Activate £1/mo
                    </button>
                  )}
                  {product.active && !product.featured && (
                    <button onClick={() => featureProduct(product.id)} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 font-bold">
                      ⭐ Feature £3/mo
                    </button>
                  )}
                  {product.active && product.stripeSubId && (
                    <button onClick={() => cancelSubscription(product.id, 'regular')}
                      disabled={cancelling === product.id + 'regular'}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-100 disabled:opacity-50">
                      {cancelling === product.id + 'regular' ? 'Cancelling...' : 'Cancel Sub'}
                    </button>
                  )}
                  {product.featured && product.featuredSubId && (
                    <button onClick={() => cancelSubscription(product.id, 'featured')}
                      disabled={cancelling === product.id + 'featured'}
                      className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-4 py-2 rounded-lg text-sm hover:bg-yellow-100 disabled:opacity-50">
                      {cancelling === product.id + 'featured' ? 'Cancelling...' : 'Cancel Feature'}
                    </button>
                  )}
                  <Link href={`/seller/products/${product.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
