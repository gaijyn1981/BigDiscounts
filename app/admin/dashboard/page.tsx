'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalSellers: number
  totalBuyers: number
  totalProducts: number
  activeProducts: number
}

interface Product {
  id: string
  title: string
  price: number
  active: boolean
  seller: { companyName: string, email: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthed(true)
      fetchData()
    } else {
      setError('Incorrect password')
    }
  }

  async function fetchData() {
    const res = await fetch('/api/admin/stats')
    const data = await res.json()
    setStats(data.stats)
    setProducts(data.products)
    setLoading(false)
  }

  async function toggleProduct(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active })
    })
    fetchData()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchData()
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Admin password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">BigDiscounts Admin</Link>
        <button onClick={() => setAuthed(false)} className="text-gray-600 hover:text-red-500">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {stats && (
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalSellers}</p>
              <p className="text-gray-600 mt-1">Sellers</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalBuyers}</p>
              <p className="text-gray-600 mt-1">Buyers</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
              <p className="text-gray-600 mt-1">Total Listings</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
              <p className="text-gray-600 mt-1">Active Listings</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-gray-500">£{product.price.toFixed(2)} · {product.seller.companyName} · {product.seller.email}</p>
                <span className={`text-sm px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toggleProduct(product.id, product.active)}
                  className={`px-4 py-2 rounded-lg text-sm text-white ${product.active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}>
                  {product.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteProduct(product.id)}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
