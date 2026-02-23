'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = `mailto:petricamarin1981@icloud.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Contact <span style={{color: '#f59e0b'}}>Us</span></h1>
          <p className="text-gray-500">We aim to respond within 24 hours.</p>
        </div>

        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-black text-white mb-2">Message Sent!</h2>
              <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
              <Link href="/"
                className="px-6 py-3 rounded-xl font-bold text-black inline-block"
                style={{background: '#f59e0b'}}>
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Your Name</label>
                <input name="name" type="text" value={form.name} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Subject</label>
                <select name="subject" value={form.subject} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}}>
                  <option value="">Select a subject</option>
                  <option value="General enquiry">General enquiry</option>
                  <option value="Seller support">Seller support</option>
                  <option value="Buyer support">Buyer support</option>
                  <option value="Report a problem">Report a problem</option>
                  <option value="Billing question">Billing question</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={update} rows={5} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90"
                style={{background: '#f59e0b'}}>
                Send Message
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 grid grid-cols-2 gap-4 text-center" style={{borderTop: '1px solid #222'}}>
            <div className="rounded-xl p-4" style={{background: '#1a1a1a'}}>
              <p className="text-2xl mb-1">✉️</p>
              <p className="text-sm font-semibold text-white">Email</p>
              <a href="mailto:petricamarin1981@icloud.com" style={{color: '#f59e0b'}} className="text-sm hover:opacity-80">petricamarin1981@icloud.com</a>
            </div>
            <div className="rounded-xl p-4" style={{background: '#1a1a1a'}}>
              <p className="text-2xl mb-1">⏰</p>
              <p className="text-sm font-semibold text-white">Response Time</p>
              <p className="text-gray-500 text-sm">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-8 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/privacy" className="text-gray-500 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-500 hover:text-white">Terms & Conditions</Link>
          <Link href="/cookies" className="text-gray-500 hover:text-white">Cookie Policy</Link>
          <Link href="/data-request" className="text-gray-500 hover:text-white">Data Request</Link>
        </div>
      </footer>
    </main>
  )
}
