'use client'
import { useState, useEffect } from 'react'

export default function FavouriteButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/favourites').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSaved(data.includes(productId))
    })
  }, [productId])

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    const data = await res.json()
    if (data.saved !== undefined) setSaved(data.saved)
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`w-full py-3 rounded-xl font-bold text-lg mt-2 transition-colors ${saved ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
      {loading ? '...' : saved ? '❤️ Saved' : '🤍 Save for Later'}
    </button>
  )
}
