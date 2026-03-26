'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<string[]>(['', '', '', ''])
  const [uploading, setUploading] = useState<boolean[]>([false, false, false, false])
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', deliveryTime: '' })
  const [customDelivery, setCustomDelivery] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/seller/products/${id}`)
      const data = await res.json()
      if (data) {
        const isCustom = data.deliveryTime && !['Next day','2-3 days','1 week','2 weeks+',''].includes(data.deliveryTime)
        setForm({ title: data.title || '', description: data.description || '', price: data.price?.toString() || '', category: data.category || '', deliveryTime: isCustom ? 'Custom' : (data.deliveryTime || '') })
        if (isCustom) setCustomDelivery(data.deliveryTime || '')
        const existingPhotos = JSON.parse(data.photos || '[]')
        setPhotos([...existingPhotos, '', '', '', ''].slice(0, 4))
      }
      setFetching(false)
    }
    if (id) fetchProduct()
  }, [id])

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
    const res = await fetch(`/api/seller/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, deliveryTime: form.deliveryTime === 'Custom' ? customDelivery : form.deliveryTime, photos: filteredPhotos })
    })
    if (res.ok) router.push('/seller/dashboard')
    else { const data = await res.json(); setError(data.error || 'Error'); setLoading(false) }
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#fcd968'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Edit Product</h1>
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
          <div>
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
                style={{background: '#1a1a1a', border: '1px solid #333'}} />
            )}
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
                      <div className="rounded-xl px-4 py-3 text-center"
                        style={{border: '2px dashed #333', background: '#1a1a1a'}}>
                        {uploading[index] ? (
                          <span className="text-sm" style={{color: '#fcd968'}}>Uploading...</span>
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
            style={{background: '#fcd968'}}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  )
}
