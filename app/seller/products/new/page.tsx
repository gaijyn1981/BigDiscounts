'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<string[]>(['', '', '', ''])
  const [uploading, setUploading] = useState<boolean[]>([false, false, false, false])
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handlePhotoUpload(index: number, file: File) {
    const newUploading = [...uploading]
    newUploading[index] = true
    setUploading(newUploading)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) {
      const newPhotos = [...photos]
      newPhotos[index] = data.url
      setPhotos(newPhotos)
    }
    const doneUploading = [...uploading]
    doneUploading[index] = false
    setUploading(doneUploading)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const filteredPhotos = photos.filter(p => p.trim() !== '')
    const res = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photos: filteredPhotos })
    })
    if (res.ok) router.push('/seller/dashboard')
    else { const data = await res.json(); setError(data.error || 'Error'); setLoading(false) }
  }

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors">← Back</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Add New Product</h1>
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{background: '#111111', border: '1px solid #222'}}>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Title</label>
            <input name="title" type="text" value={form.title} onChange={update} required
              className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={update} rows={4} required
              className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
              style={{background: '#1a1a1a', border: '1px solid #333'}} />
          </div>
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
              <option value="">Select</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
              <option value="Books">Books</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Photos (up to 4)</label>
            <div className="space-y-3">
              {photos.map((photo, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span className="text-sm text-gray-600 w-16">Photo {index + 1}</span>
                  {photo ? (
                    <div className="flex-1 flex items-center gap-2">
                      <img src={photo} alt="" className="h-16 w-16 object-cover rounded-lg" />
                      <button type="button" onClick={() => { const p = [...photos]; p[index] = ''; setPhotos(p) }}
                        className="text-red-400 text-sm hover:opacity-80">Remove</button>
                    </div>
                  ) : (
                    <label className="flex-1 cursor-pointer">
                      <div className="rounded-xl px-4 py-3 text-center transition-colors"
                        style={{border: '2px dashed #333', background: '#1a1a1a'}}>
                        {uploading[index] ? (
                          <span className="text-sm" style={{color: '#f59e0b'}}>Uploading...</span>
                        ) : (
                          <span className="text-gray-600 text-sm">📷 Click to upload photo</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(index, e.target.files[0]) }} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{background: '#f59e0b'}}>
            {loading ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>
    </main>
  )
}
