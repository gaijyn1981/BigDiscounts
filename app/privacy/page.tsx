import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-blue-200 hover:text-white">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. Who We Are</h2>
              <p>BigDiscounts is a UK-based online marketplace at www.bigdiscounts.uk connecting buyers with sellers of discounted products across the United Kingdom.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. What Data We Collect</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email address and password</li>
                <li>Name and contact details</li>
                <li>Payment information (processed securely by Stripe — we never store card details)</li>
                <li>Product listings and associated content</li>
                <li>Usage data such as pages visited</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Data</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Create and manage your account</li>
                <li>Process payments via Stripe</li>
                <li>Display your product listings to buyers</li>
                <li>Communicate with you about your account</li>
                <li>Improve our platform</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Legal Basis for Processing</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Contract performance — to provide our services</li>
                <li>Legitimate interests — to improve our platform and prevent fraud</li>
                <li>Legal obligation — to comply with UK law</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Data Sharing</h2>
              <p>We share data with Stripe (payments), Vercel (hosting), and Neon (database). We do not sell your data to third parties.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">6. Your Rights</h2>
              <p>Under UK GDPR you have the right to access, correct, delete, or port your data. Contact us to exercise these rights.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">7. Cookies</h2>
              <p>We use essential cookies only for authentication and session management. No tracking or advertising cookies.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">8. Contact</h2>
              <p>Email: <a href="mailto:privacy@bigdiscounts.uk" className="text-blue-600 hover:underline">privacy@bigdiscounts.uk</a></p>
            </section>
          </div>
        </div>
      </div>
      <footer style={{background: '#1e3a8a'}} className="py-6 text-center text-blue-200 text-sm">
        <Link href="/privacy" className="hover:text-white mx-3">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white mx-3">Terms & Conditions</Link>
      </footer>
    </main>
  )
}
