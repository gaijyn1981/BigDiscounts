'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false) }
    else router.push('/login?reset=true')
  }

  if (!token) return (
    <div className="text-center">
      <p className="text-red-400">Invalid reset link. Please request a new one.</p>
      <Link href="/forgot-password" style={{color: '#fcd968'}} className="font-bold hover:opacity-80 mt-4 block">Request new link</Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">New Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
          className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
          style={{background: '#1a1a1a', border: '1px solid #333'}} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
          className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
          style={{background: '#1a1a1a', border: '1px solid #333'}} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{background: '#fcd968'}}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  )
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: '#0a0a0a'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
          <p className="text-gray-500 mt-2">Choose a new password</p>
        </div>
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-2xl font-black text-white mb-6">Reset Password</h1>
          <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
