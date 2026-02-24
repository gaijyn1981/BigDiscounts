'use client'
import { useState } from 'react'
import BuyerTermsModal from './BuyerTermsModal'

interface Props {
  email: string
  phone: string
  paypalMe: string | null
  price: number
}

export default function ContactSellerButtons({ email, phone, paypalMe, price }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'email' | 'phone' | 'paypal' | null>(null)

  function handleClick(action: 'email' | 'phone' | 'paypal') {
    setPendingAction(action)
    setShowModal(true)
  }

  function handleAccept() {
    setShowModal(false)
    if (pendingAction === 'email') window.location.href = `mailto:${email}`
    if (pendingAction === 'phone') window.location.href = `tel:${phone}`
    if (pendingAction === 'paypal') window.open(`https://paypal.me/${paypalMe}/${price}`, '_blank')
    setPendingAction(null)
  }

  function handleDecline() {
    setShowModal(false)
    setPendingAction(null)
  }

  return (
    <>
      {showModal && <BuyerTermsModal onAccept={handleAccept} onDecline={handleDecline} />}

      {paypalMe && (
        <button onClick={() => handleClick('paypal')}
          className="block w-full text-center py-3 rounded-xl font-bold text-lg mb-2 transition-opacity hover:opacity-90"
          style={{background: '#003087', color: 'white'}}>
          💳 Buy Now via PayPal
        </button>
      )}
      <button onClick={() => handleClick('email')}
        className="block w-full text-center py-3 rounded-xl font-bold text-lg mb-2 transition-opacity hover:opacity-90"
        style={{background: '#f59e0b', color: 'black'}}>
        ✉️ Contact Seller
      </button>
      <button onClick={() => handleClick('phone')}
        className="block w-full text-center py-3 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
        style={{background: '#1a1a1a', color: 'white', border: '1px solid #333'}}>
        📞 Call Seller
      </button>
    </>
  )
}
