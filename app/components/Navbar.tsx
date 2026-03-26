'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface Props {
  session: boolean
  userName?: string
  lang?: 'en' | 'ro'
}

export default function Navbar({ session, userName, lang = 'en' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const t = {
    home: lang === 'ro' ? 'Acasă' : 'Home',
    logout: lang === 'ro' ? 'Deconectare' : 'Logout',
    sell: lang === 'ro' ? 'Vinde' : 'Sell',
    browse: lang === 'ro' ? 'Explorează' : 'Browse',
    login: lang === 'ro' ? 'Autentificare' : 'Login',
    register: lang === 'ro' ? 'Înregistrare' : 'Sign Up',
    dashboard: lang === 'ro' ? 'Panou' : 'Dashboard',
    brand: lang === 'ro' ? '🇷🇴 BigDiscounts' : '🇬🇧 BigDiscounts',
  }

  return (
    <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>{t.brand}</Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">{t.home}</Link>
        <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">{t.browse}</Link>
        <Link href="/sell" className="text-gray-400 hover:text-white transition-colors">{t.sell}</Link>
        {session ? (
          <>
            <span className="text-gray-400 text-sm">Hi, {userName}</span>
            <Link href="/seller/dashboard"
              className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm"
              style={{background: '#fcd968', color: 'black'}}>
              {t.dashboard}
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 rounded-lg font-bold text-sm hover:opacity-80 transition-opacity"
              style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
              {t.logout}
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">{t.login}</Link>
            <Link href="/register"
              className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm"
              style={{background: '#fcd968', color: 'black'}}>
              {t.register}
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span style={{
          display: 'block', width: '22px', height: '2px', background: '#fcd968',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none'
        }} />
        <span style={{
          display: 'block', width: '22px', height: '2px', background: '#fcd968',
          transition: 'opacity 0.3s ease',
          opacity: menuOpen ? 0 : 1
        }} />
        <span style={{
          display: 'block', width: '22px', height: '2px', background: '#fcd968',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none'
        }} />
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 px-6 py-4 flex flex-col gap-4"
          style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}}>
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white transition-colors py-2 border-b"
            style={{borderColor: '#1a1a1a'}}>
            {t.home}
          </Link>
          <Link href="/browse" onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white transition-colors py-2 border-b"
            style={{borderColor: '#1a1a1a'}}>
            {t.browse}
          </Link>
          <Link href="/sell" onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white transition-colors py-2 border-b"
            style={{borderColor: '#1a1a1a'}}>
            {t.sell}
          </Link>
          {session ? (
            <>
              <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)}
                className="py-3 rounded-lg font-bold text-center"
                style={{background: '#fcd968', color: 'black'}}>
                {t.dashboard}
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="py-3 rounded-lg font-bold text-center"
                style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white transition-colors py-2 border-b"
                style={{borderColor: '#1a1a1a'}}>
                {t.login}
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="py-3 rounded-lg font-bold text-center"
                style={{background: '#fcd968', color: 'black'}}>
                {t.register}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
