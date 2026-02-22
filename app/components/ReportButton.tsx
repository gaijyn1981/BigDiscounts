'use client'
import { useState } from 'react'

export default function ReportButton({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, reason })
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="w-full text-center text-gray-400 text-sm hover:text-red-500 mt-2 py-1">
      🚩 Report this listing
    </button>
  )

  if (submitted) return (
    <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 text-sm">
      ✅ Report submitted. Thank you!
    </div>
  )

  return (
    <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="font-semibold text-red-800 text-sm mb-2">Report this listing</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <select value={reason} onChange={e => setReason(e.target.value)} required
          className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">Select a reason</option>
          <option value="Fraudulent listing">Fraudulent listing</option>
          <option value="Counterfeit goods">Counterfeit goods</option>
          <option value="Prohibited item">Prohibited item</option>
          <option value="Wrong category">Wrong category</option>
          <option value="Offensive content">Offensive content</option>
          <option value="Other">Other</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-600 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
          <button type="button" onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
