'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState(['', '', '', ''])
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: ''
  })

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function updatePhoto(index: number, value: string) {
    const updated = [...photos]
    updated[index] = value
    setPhotos(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const filteredPhotos = photos.filter(p => p.trim() !== '')

    const res = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photos: filteredPhotos })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
    } else {
      router.push('/seller/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-600 hover:text-blue-600">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">💡 Each product listing costs <strong>£1/month</strong>. Your product will go live once payment is set up.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
            <input name="title" type="text" onChange={update}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" onChange={update}
              placeholder="Describe your product in detail..."
              rows={4} className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
            <input name="price" type="number" step="0.01" min="0" onChange={update} placeholder="9.99"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" onChange={update}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a category</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos (up to 4 image URLs)</label>
            <div className="space-y-3">
              {photos.map((photo, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span className="text-sm text-gray-500 w-16">Photo {index + 1}</span>
                  <input
                    type="url"
                    value={photo}
                    onChange={e => updatePhoto(index, e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Paste image URLs from the web or your image hosting service</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </main>
  )
}
