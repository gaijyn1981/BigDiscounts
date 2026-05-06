'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export default function NotificationToggle({ userType }: { userType: 'seller' | 'buyer' }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'loading'>('idle')
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setSupported(true)
    if (Notification.permission === 'denied') { setStatus('denied'); return }
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setStatus('subscribed')
      })
    )
  }, [])

  if (!supported || !session) return null

  async function subscribe() {
    setStatus('loading')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), userType }),
      })
      setStatus('subscribed')
    } catch {
      setStatus('idle')
    }
  }

  async function unsubscribe() {
    setStatus('loading')
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      })
      await sub.unsubscribe()
    }
    setStatus('idle')
  }

  if (status === 'denied') {
    return (
      <p className="text-xs text-gray-400">
        Notifications blocked. Enable them in browser settings.
      </p>
    )
  }

  return (
    <button
      onClick={status === 'subscribed' ? unsubscribe : subscribe}
      disabled={status === 'loading'}
      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-colors ${
        status === 'subscribed'
          ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
          : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
      } disabled:opacity-50`}
    >
      <span>{status === 'subscribed' ? '🔔' : '🔕'}</span>
      <span>
        {status === 'loading'
          ? 'Please wait…'
          : status === 'subscribed'
          ? 'Notifications on'
          : 'Enable notifications'}
      </span>
    </button>
  )
}
