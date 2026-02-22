'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function DataRequest() {
  const [form, setForm] = useState({ name: '', email: '', type: 'deletion', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Data Request</h1>
          <p className="text-gray-500 mb-8">Under UK GDPR you have the right to access, correct, or delete your personal data. Fill in the form below and we will respond within 30 days.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Request Submitted</h2>
              <p className="text-green-600">Thank you. We will respond to your request within 30 days at the email address you provided.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={update} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Request Type</label>
                <select name="type" value={form.type} onChange={update}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="deletion">Delete my data</option>
                  <option value="access">Access my data</option>
                  <option value="correction">Correct my data</option>
                  <option value="portability">Export my data</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Details (optional)</label>
                <textarea name="message" value={form.message} onChange={update} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit"
                className="w-full text-white py-3 rounded-xl font-bold text-lg"
                style={{background: '#1e3a8a'}}>
                Submit Request
              </button>
              <p className="text-xs text-gray-400 text-center">We will respond within 30 days to the email address provided.</p>
            </form>
          )}
        </div>
      </div>
      <footer style={{background: '#1e3a8a'}} className="py-6 text-center text-blue-200 text-sm">
        <Link href="/privacy" className="hover:text-white mx-3">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white mx-3">Terms & Conditions</Link>
        <Link href="/cookies" className="hover:text-white mx-3">Cookie Policy</Link>
      </footer>
    </main>
  )
}
