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
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-blue-200 hover:text-white">← Back to Home</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500 mb-8">Have a question or need help? We'd love to hear from you. We aim to respond within 24 hours.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h2>
              <p className="text-green-600">Thanks for getting in touch. We'll get back to you within 24 hours.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Back to Home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input name="name" type="text" value={form.name} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select name="subject" value={form.subject} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={update} rows={5} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit"
                className="w-full text-white py-3 rounded-xl font-bold text-lg"
                style={{background: '#1e3a8a'}}>
                Send Message
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl mb-1">✉️</p>
              <p className="text-sm font-semibold text-gray-700">Email</p>
              <a href="mailto:petricamarin1981@icloud.com" className="text-blue-600 text-sm hover:underline">petricamarin1981@icloud.com</a>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl mb-1">⏰</p>
              <p className="text-sm font-semibold text-gray-700">Response Time</p>
              <p className="text-gray-500 text-sm">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{background: '#1e3a8a'}} className="py-6 text-center text-blue-200 text-sm">
        <Link href="/privacy" className="hover:text-white mx-3">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white mx-3">Terms & Conditions</Link>
        <Link href="/cookies" className="hover:text-white mx-3">Cookie Policy</Link>
        <Link href="/data-request" className="hover:text-white mx-3">Data Request</Link>
      </footer>
    </main>
  )
}
