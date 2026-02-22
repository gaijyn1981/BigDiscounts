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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          🍪 We use essential cookies to keep you logged in and make the site work. No tracking or advertising cookies.{' '}
          <Link href="/privacy" className="text-yellow-400 hover:underline">Learn more</Link>
        </p>
        <button onClick={accept}
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-300 whitespace-nowrap">
          Got it!
        </button>
      </div>
    </div>
  )
}
