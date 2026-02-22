'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email, password, role, redirect: false
    })
    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push(role === 'seller' ? '/seller/dashboard' : '/browse')
    }
  }

  return (
    <main className="min-h-screen" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'}}>
      <nav className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
      </nav>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-6">Sign in to your account</p>

          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button onClick={() => setRole('buyer')}
              className={`flex-1 py-3 font-semibold transition-colors ${role === 'buyer' ? 'text-white' : 'text-gray-600 bg-gray-50'}`}
              style={role === 'buyer' ? {background: '#1e3a8a'} : {}}>
              Buyer
            </button>
            <button onClick={() => setRole('seller')}
              className={`flex-1 py-3 font-semibold transition-colors ${role === 'seller' ? 'text-white' : 'text-gray-600 bg-gray-50'}`}
              style={role === 'seller' ? {background: '#1e3a8a'} : {}}>
              Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full text-white py-3 rounded-xl font-bold text-lg disabled:opacity-50"
              style={{background: '#1e3a8a'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
