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
  const [photos, setPhotos] = useState(['', '', '', ''])
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' })

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/seller/products/${id}`)
      const data = await res.json()
      if (data) {
        setForm({ title: data.title || '', description: data.description || '', price: data.price?.toString() || '', category: data.category || '' })
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const filteredPhotos = photos.filter(p => p.trim() !== '')
    const res = await fetch(`/api/seller/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photos: filteredPhotos })
    })
    if (res.ok) router.push('/seller/dashboard')
    else { const data = await res.json(); setError(data.error || 'Error'); setLoading(false) }
  }

  if (fetching) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-600 hover:text-blue-600">← Back</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" type="text" value={form.title} onChange={update} required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={update} rows={4} required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={update} required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={update} className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Photos (up to 4)</label>
            <div className="space-y-3">{photos.map((photo, index) => (
              <div key={index} className="flex gap-3 items-center">
                <span className="text-sm text-gray-500 w-16">Photo {index + 1}</span>
                <input type="url" value={photo} onChange={e => { const u = [...photos]; u[index] = e.target.value; setPhotos(u) }}
                  placeholder="https://example.com/photo.jpg" className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>))}</div></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </main>
  )
}
