'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer'
  const [role, setRole] = useState<'buyer' | 'seller'>(defaultRole)
  const [form, setForm] = useState({ email: '', password: '', name: '', companyName: '', contactName: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/register/${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false) }
    else router.push('/login')
  }

  return (
    <main className="min-h-screen" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'}}>
      <nav className="px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
      </nav>
      <div className="flex items-center justify-center px-6 py-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-500 mb-6">Join BigDiscounts today</p>

          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button onClick={() => setRole('buyer')}
              className={`flex-1 py-3 font-semibold transition-colors ${role === 'buyer' ? 'text-white' : 'text-gray-600 bg-gray-50'}`}
              style={role === 'buyer' ? {background: '#1e3a8a'} : {}}>
              I'm a Buyer
            </button>
            <button onClick={() => setRole('seller')}
              className={`flex-1 py-3 font-semibold transition-colors ${role === 'seller' ? 'text-white' : 'text-gray-600 bg-gray-50'}`}
              style={role === 'seller' ? {background: '#1e3a8a'} : {}}>
              I'm a Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'buyer' ? (
              <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={update} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            ) : (
              <>
                <input name="companyName" type="text" placeholder="Company Name" value={form.companyName} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="contactName" type="text" placeholder="Contact Name" value={form.contactName} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </>
            )}
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full text-white py-3 rounded-xl font-bold text-lg disabled:opacity-50"
              style={{background: '#1e3a8a'}}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>
}
