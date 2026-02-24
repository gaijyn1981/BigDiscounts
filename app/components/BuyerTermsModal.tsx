'use client'
import { useState } from 'react'

interface Props {
  onAccept: () => void
  onDecline: () => void
}

export default function BuyerTermsModal({ onAccept, onDecline }: Props) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{background: 'rgba(0,0,0,0.85)'}}>
      <div className="w-full max-w-md rounded-2xl p-8"
        style={{background: '#111111', border: '1px solid #f59e0b'}}>
        <h2 className="text-2xl font-black text-white mb-2">Before You Continue</h2>
        <p className="text-gray-400 text-sm mb-4">By contacting this seller or buying this product you agree to our Terms & Conditions including:</p>
        <ul className="text-gray-400 text-sm space-y-2 mb-6">
          <li className="flex gap-2"><span style={{color: '#f59e0b'}}>•</span> Transactions are directly between you and the seller</li>
          <li className="flex gap-2"><span style={{color: '#f59e0b'}}>•</span> BigDiscounts is not responsible for payments or disputes</li>
          <li className="flex gap-2"><span style={{color: '#f59e0b'}}>•</span> You have a 14-day return right under UK Consumer Contracts Regulations</li>
          <li className="flex gap-2"><span style={{color: '#f59e0b'}}>•</span> Sellers are responsible for shipping and returns</li>
        </ul>
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
            className="w-5 h-5 rounded accent-yellow-400" />
          <span className="text-gray-300 text-sm">I have read and agree to the <a href="/terms" target="_blank" style={{color: '#f59e0b'}} className="hover:opacity-80 underline">Terms & Conditions</a></span>
        </label>
        <div className="flex gap-3">
          <button onClick={onDecline}
            className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-80"
            style={{background: '#1a1a1a', border: '1px solid #333'}}>
            Cancel
          </button>
          <button onClick={onAccept} disabled={!checked}
            className="flex-1 py-3 rounded-xl font-black text-black transition-opacity hover:opacity-90 disabled:opacity-30"
            style={{background: '#f59e0b'}}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
