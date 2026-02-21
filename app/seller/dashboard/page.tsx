'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  category: string
  active: boolean
}

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

  if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">BigDiscounts</Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-600 hover:text-red-500">Logout</button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <Link href="/seller/products/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">+ Add Product</Link>
        </div>
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500 text-lg mb-4">You haven't listed any products yet.</p>
            <Link href="/seller/products/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">List Your First Product</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-gray-500">£{product.price.toFixed(2)} · {product.category || 'No category'}</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {product.active ? 'Active' : 'Pending payment'}
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  {!product.active && (
                    <button onClick={() => activateProduct(product.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                      Activate £1/mo
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
