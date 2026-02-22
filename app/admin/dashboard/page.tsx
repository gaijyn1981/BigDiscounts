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
  seller: { companyName: string, email: string }
}

interface Report {
  id: string
  productId: string
  reason: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(data => {
      setStats(data.stats)
      setProducts(data.products)
      setReports(data.reports || [])
      setLoading(false)
    })
  }, [])

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(products.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#f0f4ff'}}>
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  )

  const monthlyRevenue = (stats?.activeProducts || 0) * 1

  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <span className="text-blue-200 font-semibold">Admin Dashboard</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Admin Overview</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-600">
            <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Total Sellers</p>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats?.totalSellers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-yellow-400">
            <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Total Buyers</p>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats?.totalBuyers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-green-500">
            <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Active Listings</p>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats?.activeProducts}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-purple-500">
            <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Monthly Revenue</p>
            <p className="text-4xl font-black text-gray-900 mt-2">£{monthlyRevenue}</p>
          </div>
        </div>

        {reports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
              <h2 className="text-xl font-black text-red-800">🚩 Reports ({reports.length})</h2>
            </div>
            <div className="divide-y">
              {reports.map(report => (
                <div key={report.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{report.reason}</p>
                    <p className="text-sm text-gray-400">Product ID: {report.productId}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/product/${report.productId}`} target="_blank"
                      className="text-blue-600 text-sm hover:underline">View</Link>
                    <button onClick={() => deleteProduct(report.productId)}
                      className="text-red-500 text-sm hover:underline">Delete Product</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">All Products ({stats?.totalProducts})</h2>
            <span className="text-sm text-gray-400">{stats?.activeProducts} active · {(stats?.totalProducts || 0) - (stats?.activeProducts || 0)} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{background: '#f0f4ff'}}>
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">Seller</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">Price</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} style={{background: i % 2 === 0 ? 'white' : '#f9fafb'}}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{product.title}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{product.seller.companyName}</p>
                      <p className="text-sm text-gray-400">{product.seller.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-700">£{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {product.active ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
