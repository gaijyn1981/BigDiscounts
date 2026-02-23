'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email, password, redirect: false
    })
    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/seller/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: '#0a0a0a'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-2xl font-black text-white mb-6">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                style={{background: '#1a1a1a', border: '1px solid #333'}} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                style={{background: '#1a1a1a', border: '1px solid #333'}} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{background: '#f59e0b'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{borderTop: '1px solid #222'}}>
            <p className="text-center text-gray-500 text-sm mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/register?type=seller"
                className="py-3 rounded-xl font-bold text-sm text-black text-center transition-opacity hover:opacity-90"
                style={{background: '#f59e0b'}}>
                Register as Seller
              </Link>
              <Link href="/register?type=buyer"
                className="py-3 rounded-xl font-bold text-sm text-white text-center transition-opacity hover:opacity-80"
                style={{background: '#1a1a1a', border: '1px solid #333'}}>
                Register as Buyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
