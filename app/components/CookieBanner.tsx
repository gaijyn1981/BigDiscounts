'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookiesAccepted', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4"
      style={{background: '#111111', borderTop: '1px solid #2a2a2a'}}>
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-gray-400 text-sm flex-1">
          🍪 We use essential cookies to keep you logged in.{' '}
          <Link href="/cookies" style={{color: '#fcd968'}} className="hover:opacity-80 underline">
            Learn more
          </Link>
        </p>
        <button onClick={accept}
          className="px-6 py-2 rounded-xl font-bold text-sm text-black transition-opacity hover:opacity-90"
          style={{background: '#fcd968'}}>
          Got it!
        </button>
      </div>
    </div>
  )
}
