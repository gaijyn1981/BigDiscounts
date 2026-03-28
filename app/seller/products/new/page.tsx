'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', deliveryTime: '' })
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [customDelivery, setCustomDelivery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowTerms(true)
  }

  async function handleSubmit() {
    setShowTerms(false)
    setLoading(true)
    setError('')
    const res = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, deliveryTime: form.deliveryTime === 'Custom' ? customDelivery : form.deliveryTime, photos })
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

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Add New Product</h1>

        <form onSubmit={handleFormSubmit} className="space-y-6" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #222'}}>
            <h2 className="text-lg font-black text-white mb-4">Product Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Title</label>
                <input name="title" value={form.title} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                  onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={update} required rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none resize-none"
                  style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                  onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Price (£)</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={update} required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                    style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                  onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
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
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-400 mb-1">Delivery Time <span className="text-gray-600 font-normal">(optional)</span></label>
                <select name="deliveryTime" value={form.deliveryTime} onChange={update}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}}>
                  <option value="">Not specified</option>
                  <option value="Next day">Next day</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks+">2 weeks+</option>
                  <option value="Custom">Custom</option>
                </select>
                {form.deliveryTime === 'Custom' && (
                  <input value={customDelivery} onChange={e => setCustomDelivery(e.target.value)}
                    placeholder="e.g. 3-5 working days"
                    className="w-full mt-2 px-4 py-3 rounded-xl text-white focus:outline-none"
                    style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                  onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
                )}
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
      {/* Seller Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background: 'rgba(0,0,0,0.85)'}}>
          <div className="w-full max-w-md rounded-2xl p-8" style={{background: '#111111', border: '1px solid #fcd968'}}>
            <h2 className="text-xl font-black text-white mb-2">Before You Publish</h2>
            <p className="text-gray-500 text-sm mb-6">By listing on BigDiscounts you agree to the following:</p>
            <ul className="space-y-3 mb-6">
              {[
                'Ship products promptly after receiving payment from the buyer',
                'Ensure product descriptions and photos are accurate and not misleading',
                'Accept returns within 14 days under UK Consumer Contracts Regulations 2013',
                'Issue refunds within 14 days of receiving a return from the buyer',
                'BigDiscounts is not liable for disputes between buyers and sellers',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-1 text-sm" style={{color: '#fcd968'}}>•</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-gray-400 text-sm">I understand and agree to these terms</span>
            </label>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={!termsAccepted}
                className="flex-1 py-3 rounded-xl font-black text-black transition-opacity hover:opacity-90 disabled:opacity-30"
                style={{background: '#fcd968'}}>
                Publish Listing
              </button>
              <button onClick={() => setShowTerms(false)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:opacity-80"
                style={{background: '#1a1a1a', border: '1px solid #333'}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
