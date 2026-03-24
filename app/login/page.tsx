'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      const role = sessionData?.user?.role
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        const profileRes = await fetch('/api/seller/profile')
        if (profileRes.ok) {
          router.push('/seller/dashboard')
        } else {
          router.push('/buyer/dashboard')
        }
      }
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: '#0a0a0a'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
  <Link href="/" className="text-3xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
  <p className="text-gray-500 mt-2">Sign in to your account</p>
  <Link href="/" className="inline-flex items-center gap-2 mt-3 text-sm text-gray-500 hover:text-white transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    Back to homepage
  </Link>
</div>

        <div className="rounded-2xl p-8" style={{
          background: '#111111',
          border: '1px solid #222',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <h1 className="text-2xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in as a seller or buyer — we'll take you to the right place.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                style={{background: '#1a1a1a', border: '1px solid #333', transition: 'border-color 0.2s ease, box-shadow 0.2s ease'}}
                onFocus={e => { e.currentTarget.style.borderColor = '#fcd968'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(252,217,104,0.15)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none' }} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{background: '#fcd968'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-right mt-2"><Link href="/forgot-password" style={{color: '#fcd968'}} className="text-sm hover:opacity-80">Forgot password?</Link></p>
          <div className="mt-8 pt-6" style={{borderTop: '1px solid #222'}}>
            <p className="text-center text-gray-500 text-sm mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/register?type=seller"
                className="py-3 rounded-xl font-bold text-sm text-black text-center transition-opacity hover:opacity-90"
                style={{background: '#fcd968'}}>
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
