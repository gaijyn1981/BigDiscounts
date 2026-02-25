'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false) }
    else setSent(true)
  }

  if (sent) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: '#0a0a0a'}}>
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-black text-white mb-2">Check Your Email!</h1>
          <p className="text-gray-400 mb-6">We sent a password reset link to <span style={{color: '#fcd968'}}>{email}</span>.</p>
          <Link href="/login"
            className="block w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90"
            style={{background: '#fcd968'}}>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: '#0a0a0a'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-2xl font-black text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                style={{background: '#1a1a1a', border: '1px solid #333'}} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{background: '#fcd968'}}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6 text-sm">
            Remember your password?{' '}
            <Link href="/login" style={{color: '#fcd968'}} className="font-bold hover:opacity-80">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
