'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteAccountButton from '@/app/components/DeleteAccountButton'

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

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#f59e0b'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">Seller Profile</h1>

        <div className="rounded-2xl p-6 mb-6" style={{background: '#111111', border: '1px solid #222'}}>
          <h2 className="text-xl font-black text-white mb-2">Payment Settings</h2>
          <p className="text-gray-500 mb-6 text-sm">Add your PayPal.me link so buyers can pay you directly.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">PayPal.me link</label>
              <div className="flex items-center rounded-xl overflow-hidden" style={{border: '1px solid #333'}}>
                <span className="px-4 py-3 text-gray-500 text-sm" style={{background: '#1a1a1a', borderRight: '1px solid #333'}}>paypal.me/</span>
                <input type="text" value={paypalMe} onChange={e => setPaypalMe(e.target.value)}
                  placeholder="yourusername"
                  className="flex-1 px-4 py-3 text-white focus:outline-none"
                  style={{background: '#1a1a1a'}} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Enter just your username, e.g. "johnsmith"</p>
            </div>

            {saved && (
              <div className="rounded-xl px-4 py-3 text-sm"
                style={{background: '#0a1a0a', border: '1px solid #4ade80', color: '#4ade80'}}>
                ✅ Profile saved successfully!
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{background: '#f59e0b'}}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #f87171'}}>
          <h2 className="text-xl font-black text-white mb-2">Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all your listings.</p>
          <DeleteAccountButton type="seller" />
        </div>
      </div>
    </main>
  )
}
