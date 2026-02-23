'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const router = useRouter()

  useEffect(() => {
    fetch('/admin/dashboard', {
      headers: {
        'Authorization': 'Basic ' + btoa('logout:logout')
      }
    }).finally(() => {
      router.push('/')
    })
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p className="text-white font-bold text-lg">Logging out...</p>
    </main>
  )
}
