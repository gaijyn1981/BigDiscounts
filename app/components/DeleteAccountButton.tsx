'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function DeleteAccountButton({ type }: { type: 'seller' | 'buyer' }) {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    const endpoint = type === 'seller' ? '/api/seller/delete-account' : '/api/buyer/delete-account'
    const res = await fetch(endpoint, { method: 'DELETE' })
    if (res.ok) {
      await signOut({ callbackUrl: '/?deleted=true' })
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
      setDeleting(false)
    }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}
        className="text-sm font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
        style={{background: '#1a0a0a', color: '#f87171', border: '1px solid #f87171'}}>
        🗑️ Delete Account
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{background: 'rgba(0,0,0,0.8)'}}>
          <div className="w-full max-w-md rounded-2xl p-8 text-center"
            style={{background: '#111111', border: '1px solid #f87171'}}>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-white mb-2">Delete Account?</h2>
            <p className="text-gray-400 mb-2">This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone.</p>
            {type === 'seller' && (
              <p className="text-gray-500 text-sm mb-6">All your products and listings will also be deleted.</p>
            )}
            {type === 'buyer' && (
              <p className="text-gray-500 text-sm mb-6">All your saved products will also be deleted.</p>
            )}
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-black text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{background: '#1a1a1a', border: '1px solid #333'}}>
                No, Keep Account
              </button>
              <button onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl font-black transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{background: '#f87171', color: 'black'}}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
