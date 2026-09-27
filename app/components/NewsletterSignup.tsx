'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error'); setMessage(data.error || 'Something went wrong.')
        return
      }
      setStatus('done')
      setMessage(data.alreadySubscribed ? "You're already subscribed." : "Thanks, you're on the list!")
      setEmail('')
    } catch {
      setStatus('error'); setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="mb-8 pb-8" style={{ borderBottom: '1px solid #1a1a1a' }}>
      <p className="text-white font-bold mb-1">Get the best deals first</p>
      <p className="text-gray-500 text-sm mb-4">New listings and discounts, straight to your inbox. No spam.</p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black disabled:opacity-60"
          style={{ background: '#fcd968' }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`text-sm mt-3 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
      )}
      <p className="text-gray-600 text-xs mt-3">
        Unsubscribe any time by emailing hello.bigdiscounts@gmail.com. See our <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
      </p>
    </div>
  )
}
