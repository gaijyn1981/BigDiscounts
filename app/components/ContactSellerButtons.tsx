"use client"
import { useState } from "react"
import BuyerTermsModal from "./BuyerTermsModal"

interface Props {
  email: string
  phone: string
  paypalMe: string | null
  price: number
  productId: string
  productTitle: string
}

export default function ContactSellerButtons({ email, phone, paypalMe, price, productId, productTitle }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<"email" | "phone" | "paypal" | "enquiry" | null>(null)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  function handleClick(action: "email" | "phone" | "paypal") {
    setPendingAction(action)
    setShowModal(true)
  }

  function handleAccept() {
    setShowModal(false)
    if (pendingAction === "email") setShowEnquiry(true)
    if (pendingAction === "phone") window.location.href = `tel:${phone}`
    if (pendingAction === "paypal") window.open(`https://paypal.me/${paypalMe}/${price}`, "_blank")
    setPendingAction(null)
  }

  function handleDecline() {
    setShowModal(false)
    setPendingAction(null)
  }

  async function handleSendEnquiry() {
    setError("")
    if (!buyerName.trim()) return setError("Please enter your name.")
    if (!buyerEmail.trim()) return setError("Please enter your email.")
    if (!message.trim()) return setError("Please enter a message.")

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerName, buyerEmail, message }),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSent(true)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {showModal && <BuyerTermsModal onAccept={handleAccept} onDecline={handleDecline} />}

      {paypalMe && (
        <button onClick={() => handleClick("paypal")}
          className="block w-full text-center py-3 rounded-xl font-bold text-lg mb-2 transition-opacity hover:opacity-90"
          style={{ background: "#003087", color: "white" }}>
          💳 Buy Now via PayPal
        </button>
      )}

      <button onClick={() => handleClick("email")}
        className="block w-full text-center py-3 rounded-xl font-bold text-lg mb-2 transition-opacity hover:opacity-90"
        style={{ background: "#fcd968", color: "black" }}>
        ✉️ Contact Seller
      </button>

      <button onClick={() => handleClick("phone")}
        className="block w-full text-center py-3 rounded-xl font-bold text-lg mb-2 transition-opacity hover:opacity-90"
        style={{ background: "#1a1a1a", color: "white", border: "1px solid #333" }}>
        📞 Call Seller
      </button>

      {showEnquiry && !sent && (
        <div className="mt-3 rounded-xl p-4 space-y-3" style={{ background: "#111", border: "1px solid #333" }}>
          <p className="text-sm font-bold" style={{ color: "#fcd968" }}>Send a message to the seller</p>
          <input
            type="text"
            placeholder="Your name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent border border-gray-700 focus:outline-none focus:border-yellow-400"
          />
          <input
            type="email"
            placeholder="Your email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent border border-gray-700 focus:outline-none focus:border-yellow-400"
          />
          <textarea
            placeholder={`Hi, I'm interested in ${productTitle}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={2000}
            className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent border border-gray-700 focus:outline-none focus:border-yellow-400 resize-none"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSendEnquiry} disabled={sending}
              className="flex-1 py-2 rounded-lg font-bold text-sm text-black disabled:opacity-50"
              style={{ background: "#fcd968" }}>
              {sending ? "Sending..." : "Send Message"}
            </button>
            <button onClick={() => setShowEnquiry(false)}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {sent && (
        <div className="mt-3 rounded-xl p-4 text-center" style={{ background: "#0a1a0a", border: "1px solid #4ade80" }}>
          <p className="text-green-400 font-bold text-sm">✅ Message sent! The seller will reply to your email.</p>
        </div>
      )}
    </>
  )
}
