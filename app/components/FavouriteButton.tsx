'use client'
import { useState, useEffect } from 'react'
import { Toast, useToast } from './Toast'

export default function FavouriteButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast, showToast, hideToast } = useToast()

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
    if (data.saved !== undefined) {
      setSaved(data.saved)
      showToast(data.saved ? '❤️ Saved to favourites' : '🤍 Removed from favourites', data.saved ? 'success' : 'info')
    }
    setLoading(false)
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <button onClick={toggle} disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-lg mt-2 transition-all duration-200 ${saved
          ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        style={{ transform: loading ? 'scale(0.98)' : 'scale(1)' }}>
        {loading ? '...' : saved ? '❤️ Saved' : '🤍 Save for Later'}
      </button>
    </>
  )
}
