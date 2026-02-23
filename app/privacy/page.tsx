import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-600 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-white mb-2">1. Who We Are</h2>
              <p>BigDiscounts is operated by Petrica Marin, a sole trader based in Gloucester, UK. Contact: hello@bigdiscounts.uk</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">2. Data We Collect</h2>
              <p>We collect: name, email address, company details (sellers), phone number (sellers), and product listings you create.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">3. Legal Basis</h2>
              <p>We process your data under: contract performance (to provide our service), legitimate interest (to improve the platform), and legal obligation (UK GDPR compliance).</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">4. Data Sharing</h2>
              <p>We share data with: Stripe (payment processing), Vercel (hosting), Neon (database), and Cloudinary (image storage). We never sell your data.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">5. Your Rights</h2>
              <p>Under UK GDPR you have the right to access, correct, delete, or export your data. Submit a request at <Link href="/data-request" style={{color: '#f59e0b'}} className="hover:opacity-80">our data request page</Link>.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">6. Cookies</h2>
              <p>We use essential cookies only for authentication and session management. See our <Link href="/cookies" style={{color: '#f59e0b'}} className="hover:opacity-80">Cookie Policy</Link>.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">7. Contact</h2>
              <p>Email: <a href="mailto:privacy@bigdiscounts.uk" style={{color: '#f59e0b'}} className="hover:opacity-80">privacy@bigdiscounts.uk</a></p>
            </section>
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
