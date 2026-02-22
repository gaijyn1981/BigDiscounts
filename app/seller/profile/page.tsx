'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paypalMe, setPaypalMe] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/seller/profile').then(r => r.json()).then(data => {
        setPaypalMe(data.paypalMe || '')
        setLoading(false)
      })
    }
  }, [status])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/seller/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paypalMe })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">🇬🇧 BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-600 hover:text-blue-600">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Profile</h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Settings</h2>
          <p className="text-gray-500 mb-6">Add your PayPal.me link so buyers can pay you directly. Leave blank to hide the PayPal button.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PayPal.me link</label>
              <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="bg-gray-50 px-4 py-3 text-gray-500 border-r text-sm">paypal.me/</span>
                <input type="text" value={paypalMe} onChange={e => setPaypalMe(e.target.value)}
                  placeholder="yourusername"
                  className="flex-1 px-4 py-3 focus:outline-none" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter just your username, e.g. "johnsmith" not the full URL</p>
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm">
                ✅ Profile saved successfully!
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
