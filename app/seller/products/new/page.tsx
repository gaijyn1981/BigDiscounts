'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && (session.user as any).role !== 'seller') router.push('/buyer/dashboard')
  }, [status, session])

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || photos.length >= 4) return
    setUploading(true)
    for (const file of Array.from(files)) {
      if (photos.length >= 4) break
      const data = new FormData()
      data.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: data })
      const json = await res.json()
      if (json.url) setPhotos(prev => [...prev, json.url])
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photos })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false) }
    else router.push('/seller/dashboard')
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#fcd968'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #222'}}>
            <h2 className="text-lg font-black text-white mb-4">Product Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Title</label>
                <input name="title" value={form.title} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={update} required rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none resize-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Price (£)</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={update} required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                    style={{background: '#1a1a1a', border: '1px solid #333'}} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={update}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                    style={{background: '#1a1a1a', border: '1px solid #333'}}>
                                        <option value="">Select category</option>
                    <option value="Electronics & Tech">Electronics & Tech</option>
                    <option value="Phone & Accessories">Phone & Accessories</option>
                    <option value="Clothing & Fashion">Clothing & Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Garden & Outdoor">Garden & Outdoor</option>
                    <option value="Pets">Pets</option>
                    <option value="Baby & Kids">Baby & Kids</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Tools & DIY">Tools & DIY</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Arts & Crafts">Arts & Crafts</option>
                    <option value="Office & Business">Office & Business</option>
                    <option value="Gifts & Seasonal">Gifts & Seasonal</option>
                    <option value="Cleaning & Household">Cleaning & Household</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #222'}}>
            <h2 className="text-lg font-black text-white mb-2">Photos</h2>
            <p className="text-gray-500 text-sm mb-4">Upload up to 4 photos of your product.</p>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative">
                  <img src={photo} alt="" className="w-full h-20 object-cover rounded-lg" />
                  <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-white"
                    style={{background: '#f87171'}}>×</button>
                </div>
              ))}
              {photos.length < 4 && (
                <label className="w-full h-20 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                  style={{background: '#1a1a1a', border: '2px dashed #333'}}>
                  {uploading ? '...' : '+'}
                  <input type="file" accept="image/*" multiple onChange={uploadPhoto} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-black text-xl text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{background: '#fcd968'}}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </main>
  )
}
