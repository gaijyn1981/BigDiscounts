'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface Buyer {
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'products' | 'sellers' | 'buyers' | 'reports'>('products')
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [editForm, setEditForm] = useState({ companyName: '', contactName: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.email || (session.user as any).role !== 'admin') {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    if (!session?.user?.email || (session.user as any).role !== 'admin') return
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/sellers').then(r => r.json()),
      fetch('/api/admin/buyers').then(r => r.json())
    ]).then(([statsData, sellersData, buyersData]) => {
      setStats(statsData.stats)
      setProducts(statsData.products || [])
      setReports(statsData.reports || [])
      setSellers(sellersData)
      setBuyers(buyersData)
      setLoading(false)
    })
  }, [session])

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const toggleVerified = async (id: string, verified: boolean) => {
    await fetch(`/api/admin/sellers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified })
    })
    setSellers(prev => prev.map(s => s.id === id ? { ...s, verified } : s))
  }

  const toggleBuyerVerified = async (id: string, emailVerified: boolean) => {
    await fetch('/api/admin/buyers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, emailVerified })
    })
    setBuyers(prev => prev.map(b => b.id === id ? { ...b, emailVerified } : b))
  }

  const saveSellerEdit = async () => {
    if (!editingSeller) return
    setSaving(true)
    await fetch(`/api/admin/sellers/${editingSeller.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
    setSellers(prev => prev.map(s => s.id === editingSeller.id ? { ...s, ...editForm } : s))
    setEditingSeller(null)
    setSaving(false)
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!session?.user?.email || (session.user as any).role !== 'admin') return null

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-2xl font-black" style={{color: '#fcd968'}}>BigDiscounts</span>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Admin Dashboard</span>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Sellers', value: stats.totalSellers, clickTab: 'sellers' as const },
              { label: 'Buyers', value: stats.totalBuyers, clickTab: 'buyers' as const },
              { label: 'Total Products', value: stats.totalProducts, clickTab: 'products' as const },
              { label: 'Active Products', value: stats.activeProducts, clickTab: null },
            ].map(s => (
              <div key={s.label}
                onClick={() => s.clickTab && setTab(s.clickTab)}
                className={`rounded-xl p-4 text-center transition-all ${s.clickTab ? 'cursor-pointer hover:scale-105' : ''}`}
                style={{
                  background: s.clickTab && tab === s.clickTab ? '#1a1a1a' : '#111',
                  border: s.clickTab && tab === s.clickTab ? '2px solid #fcd968' : '1px solid #fcd968'
                }}>
                <p className="text-3xl font-black" style={{color: '#fcd968'}}>{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'products' ? 'text-black' : 'text-gray-400'}`} style={tab === 'products' ? {background: '#fcd968'} : {background: '#1a1a1a'}}>Products</button>
          <button onClick={() => setTab('sellers')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'sellers' ? 'text-black' : 'text-gray-400'}`} style={tab === 'sellers' ? {background: '#fcd968'} : {background: '#1a1a1a'}}>Sellers</button>
          <button onClick={() => setTab('buyers')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'buyers' ? 'text-black' : 'text-gray-400'}`} style={tab === 'buyers' ? {background: '#fcd968'} : {background: '#1a1a1a'}}>Buyers</button>
          <button onClick={() => setTab('reports')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'reports' ? 'text-black' : 'text-gray-400'}`} style={tab === 'reports' ? {background: '#f87171', color: 'white'} : {background: '#1a1a1a'}}>
            Reports {reports.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{background: '#f87171', color: 'white'}}>{reports.length}</span>}
          </button>
        </div>

        {tab === 'reports' && (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-gray-400 text-lg font-bold">No reports yet</p>
                <p className="text-gray-600 text-sm mt-2">Reported products will appear here.</p>
              </div>
            ) : (
              reports.map(r => (
                <div key={r.id} className="p-4 rounded-xl flex justify-between items-start gap-4" style={{background: '#1a1a1a', border: '1px solid #f87171'}}>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">Product ID: <span style={{color: '#fcd968'}}>{r.productId}</span></p>
                    <p className="text-gray-400 text-sm mb-2">{r.reason}</p>
                    <p className="text-gray-600 text-xs">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`/product/${r.productId}`} target="_blank"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{background: '#fcd968', color: 'black'}}>
                      View
                    </a>
                    <button onClick={() => deleteProduct(r.productId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{background: '#f87171', color: 'white'}}>
                      Delete Product
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl" style={{background: '#111', border: '1px solid #2a2a2a'}}>
                <div>
                  <p className="text-white font-bold">{p.title}</p>
                  <p className="text-gray-400 text-sm">{p.seller.companyName} · £{p.price}</p>
                </div>
                <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 rounded-lg text-sm font-bold" style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'sellers' && (
          <div className="space-y-3">
            {sellers.map(s => (
              <div key={s.id} className="p-4 rounded-xl" style={{background: '#111', border: '1px solid #2a2a2a'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{s.companyName}</p>
                    <p className="text-gray-400 text-sm">{s.email} · {s.phone}</p>
                    <p className="text-gray-500 text-xs mt-1">{s._count.products} products</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleVerified(s.id, !s.verified)} className="px-3 py-1 rounded-lg text-sm font-bold" style={s.verified ? {background: '#1a1a1a', color: '#4ade80', border: '1px solid #4ade80'} : {background: '#1a1a1a', color: '#fcd968', border: '1px solid #fcd968'}}>
                      {s.verified ? 'Verified' : 'Unverified'}
                    </button>
                    <button onClick={() => { setEditingSeller(s); setEditForm({ companyName: s.companyName, contactName: s.contactName, email: s.email, phone: s.phone }) }} className="px-3 py-1 rounded-lg text-sm font-bold text-gray-400" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'buyers' && (
          <div className="space-y-3">
            {buyers.length === 0 && (
              <p className="text-gray-500 text-center py-8">No buyers registered yet.</p>
            )}
            {buyers.map(b => (
              <div key={b.id} className="p-4 rounded-xl" style={{background: '#111', border: '1px solid #2a2a2a'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{b.name}</p>
                    <p className="text-gray-400 text-sm">{b.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Joined {new Date(b.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                  <button onClick={() => toggleBuyerVerified(b.id, !b.emailVerified)} className="px-3 py-1 rounded-lg text-sm font-bold" style={b.emailVerified ? {background: '#1a1a1a', color: '#4ade80', border: '1px solid #4ade80'} : {background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
                    {b.emailVerified ? 'Verified' : 'Unverified'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingSeller && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.8)'}}>
          <div className="p-6 rounded-2xl w-full max-w-md" style={{background: '#111', border: '1px solid #2a2a2a'}}>
            <h2 className="text-white font-black text-xl mb-4">Edit Seller</h2>
            {['companyName', 'contactName', 'email', 'phone'].map(field => (
              <input key={field} value={(editForm as any)[field]} onChange={e => setEditForm(prev => ({...prev, [field]: e.target.value}))}
                placeholder={field} className="w-full mb-3 px-4 py-2 rounded-lg text-white text-sm" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}} />
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={saveSellerEdit} disabled={saving} className="flex-1 py-2 rounded-lg font-bold text-black" style={{background: '#fcd968'}}>{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setEditingSeller(null)} className="flex-1 py-2 rounded-lg font-bold text-gray-400" style={{background: '#1a1a1a'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
