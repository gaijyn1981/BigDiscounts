'use client'
import { useState, useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in`}>
      <span className="text-xl">{icons[type]}</span>
      <p className="font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 text-white opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ message, type })
  }

  function hideToast() {
    setToast(null)
  }

  return { toast, showToast, hideToast }
}
