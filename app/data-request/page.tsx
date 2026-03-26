'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function DataRequest() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', type: '', details: '' })

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = `mailto:privacy@bigdiscounts.uk?subject=Data Request: ${form.type}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nRequest Type: ${form.type}\n\nDetails: ${form.details}`)}`
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-3xl font-black text-white mb-2">Data Request</h1>
          <p className="text-gray-500 mb-8">Exercise your UK GDPR rights. We'll respond within 30 days.</p>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-black text-white mb-2">Request Submitted!</h2>
              <p className="text-gray-500">We'll respond within 30 days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Full Name</label>
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
                <label className="block text-sm font-semibold text-gray-400 mb-1">Request Type</label>
                <select name="type" value={form.type} onChange={update} required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}}>
                  <option value="">Select</option>
                  <option value="Access my data">Access my data</option>
                  <option value="Delete my data">Delete my data</option>
                  <option value="Correct my data">Correct my data</option>
                  <option value="Export my data">Export my data</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Additional Details</label>
                <textarea name="details" value={form.details} onChange={update} rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{background: '#1a1a1a', border: '1px solid #333'}} />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl font-black text-lg text-black transition-opacity hover:opacity-90"
                style={{background: '#fcd968'}}>
                Submit Request
              </button>
            </form>
          )}
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
