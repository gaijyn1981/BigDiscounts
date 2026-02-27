'use client'
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
  featured: boolean
  seller: { companyName: string, email: string }
}

interface Report {
  id: string
  productId: string
  reason: string
  createdAt: string
}

interface Seller {
  id: string
  email: string
  companyName: string
  contactName: string
  phone: string
  verified: boolean
  _count: { products: number }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'products' | 'sellers'>('products')
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [editForm, setEditForm] = useState({ companyName: '', contactName: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/sellers').then(r => r.json())
    ]).then(([statsData, sellersData]) => {
      setStats(statsData.stats)
      setProducts(statsData.products)
      setReports(statsData.reports || [])
      setSellers(sellersData)
      setLoading(false)
    })
  }, [])

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(products.filter(p => p.id !== id))
  }

  async function toggleVerified(id: string, verified: boolean) {
    await fetch(`/api/admin/sellers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: !verified })
    })
    setSellers(sellers.map(s => s.id === id ? { ...s, verified: !verified } : s))
  }

  function openEditSeller(seller: Seller) {
    setEditingSeller(seller)
    setEditForm({
      companyName: seller.companyName,
      contactName: seller.contactName,
      email: seller.email,
      phone: seller.phone,
    })
  }

  async function saveEditSeller() {
    if (!editingSeller) return
    setSaving(true)
    await fetch(`/api/admin/sellers/${editingSeller.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
    setSellers(sellers.map(s => s.id === editingSeller.id ? { ...s, ...editForm } : s))
    setSaving(false)
    setEditingSeller(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#fcd968'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  const monthlyRevenue = (stats?.activeProducts || 0) * 1

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</span>
        <span className="text-gray-400 font-semibold">Admin Dashboard</span>
        <a href="/logout" className="text-sm font-bold px-4 py-2 rounded-lg" style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>Logout</a>
      </nav>

      {/* Edit Seller Modal */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background: 'rgba(0,0,0,0.8)'}}>
          <div className="w-full max-w-md rounded-2xl p-8" style={{background: '#111111', border: '1px solid #fcd968'}}>
            <h2 className="text-xl font-black text-white mb-6">Edit Seller</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Company Name</label>
                <input value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Contact Name</label>
                <input value={editForm.contactName} onChange={e => setEditForm({...editForm, contactName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Email</label>
                <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={saveEditSeller} disabled={saving}
                className="flex-1 py-3 rounded-xl font-black text-black hover:opacity-90 transition-opacity"
                style={{background: '#fcd968'}}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditingSeller(null)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:opacity-80"
                style={{background: '#1a1a1a', border: '1px solid #333'}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Admin Overview</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #fcd968'}}>
            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Total Sellers</p>
            <p className="text-4xl font-black text-white mt-2">{stats?.totalSellers}</p>
          </div>
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #333'}}>
            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Total Buyers</p>
            <p className="text-4xl font-black text-white mt-2">{stats?.totalBuyers}</p>
          </div>
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #333'}}>
            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Active Listings</p>
            <p className="text-4xl font-black text-white mt-2">{stats?.activeProducts}</p>
          </div>
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #fcd968'}}>
            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Monthly Revenue</p>
            <p className="text-4xl font-black mt-2" style={{color: '#fcd968'}}>£{monthlyRevenue}</p>
          </div>
        </div>

        {reports.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-8" style={{background: '#111111', border: '1px solid #f87171'}}>
            <div className="px-6 py-4" style={{borderBottom: '1px solid #1a1a1a', background: '#1a0a0a'}}>
              <h2 className="text-xl font-black text-red-400">🚩 Reports ({reports.length})</h2>
            </div>
            <div className="divide-y" style={{borderColor: '#1a1a1a'}}>
              {reports.map(report => (
                <div key={report.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{report.reason}</p>
                    <p className="text-sm text-gray-600">Product ID: {report.productId}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/product/${report.productId}`} target="_blank"
                      style={{color: '#fcd968'}} className="text-sm hover:opacity-80">View</Link>
                    <button onClick={() => deleteProduct(report.productId)}
                      className="text-red-400 text-sm hover:opacity-80">Delete Product</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('products')}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={tab === 'products' ? {background: '#fcd968', color: 'black'} : {background: '#111111', color: '#888', border: '1px solid #333'}}>
            Products ({stats?.totalProducts})
          </button>
          <button onClick={() => setTab('sellers')}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={tab === 'sellers' ? {background: '#fcd968', color: 'black'} : {background: '#111111', color: '#888', border: '1px solid #333'}}>
            Sellers ({stats?.totalSellers})
          </button>
        </div>

        {tab === 'products' && (
          <div className="rounded-2xl overflow-hidden" style={{background: '#111111', border: '1px solid #222'}}>
            <div className="px-6 py-4 flex justify-between items-center" style={{borderBottom: '1px solid #1a1a1a'}}>
              <h2 className="text-xl font-black text-white">All Products</h2>
              <span className="text-sm text-gray-600">{stats?.activeProducts} active · {(stats?.totalProducts || 0) - (stats?.activeProducts || 0)} pending</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{background: '#1a1a1a'}}>
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Seller</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr key={product.id} style={{borderTop: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111111' : '#0f0f0f'}}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{product.title}</p>
                        {product.featured && <span className="text-xs font-bold" style={{color: '#fcd968'}}>⭐ Featured</span>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{product.seller.companyName}</p>
                        <p className="text-sm text-gray-600">{product.seller.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full"
                          style={product.active ? {background: '#0a1a0a', color: '#4ade80', border: '1px solid #4ade80'} : {background: '#1a1000', color: '#f97316', border: '1px solid #f97316'}}>
                          {product.active ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link href={`/seller/products/${product.id}/edit`}
                            className="text-sm font-semibold hover:opacity-80"
                            style={{color: '#fcd968'}}>
                            Edit
                          </Link>
                          <button onClick={() => deleteProduct(product.id)}
                            className="text-red-400 hover:opacity-80 font-semibold text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'sellers' && (
          <div className="rounded-2xl overflow-hidden" style={{background: '#111111', border: '1px solid #222'}}>
            <div className="px-6 py-4" style={{borderBottom: '1px solid #1a1a1a'}}>
              <h2 className="text-xl font-black text-white">All Sellers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{background: '#1a1a1a'}}>
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Company</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Contact</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Listings</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller, i) => (
                    <tr key={seller.id} style={{borderTop: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111111' : '#0f0f0f'}}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{seller.companyName}</p>
                        <p className="text-sm text-gray-600">{seller.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400">{seller.contactName}</p>
                        <p className="text-sm text-gray-600">{seller.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">{seller._count.products}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full"
                          style={seller.verified ? {background: '#0a1a0a', color: '#4ade80', border: '1px solid #4ade80'} : {background: '#1a1a1a', color: '#666', border: '1px solid #333'}}>
                          {seller.verified ? '✅ Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button onClick={() => openEditSeller(seller)}
                            className="text-sm font-semibold hover:opacity-80"
                            style={{color: '#fcd968'}}>
                            Edit
                          </button>
                          <button onClick={() => toggleVerified(seller.id, seller.verified)}
                            className="text-sm font-semibold hover:opacity-80"
                            style={{color: seller.verified ? '#f87171' : '#4ade80'}}>
                            {seller.verified ? 'Unverify' : 'Verify'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
