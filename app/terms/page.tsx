import Link from 'next/link'

export default function Terms() {
  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
          <h1 className="text-3xl font-black text-white mb-2">Terms & Conditions</h1>
          <p className="text-gray-600 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-white mb-2">1. About BigDiscounts</h2>
              <p>BigDiscounts is a UK online marketplace allowing sellers to list products for £1 per product per month. Buyers browse and contact sellers directly. BigDiscounts does not handle transactions between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">2. Seller Accounts</h2>
              <p>Sellers must be UK-based, provide accurate information, and pay £1/month per listing via Stripe. Listings activate only after successful payment. BigDiscounts may remove listings that violate these terms.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">3. Buyer Accounts</h2>
              <p>Buyers can browse for free without an account. Buyers contact sellers directly and arrange payment independently. BigDiscounts is not responsible for transactions between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">4. Payments via PayPal</h2>
              <p>Some sellers offer PayPal payment. PayPal payments are made directly between buyer and seller. BigDiscounts is not a party to any PayPal transaction and is not responsible for disputes, refunds, or chargebacks.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">5. Returns & Refunds</h2>
              <p>Under UK Consumer Contracts Regulations 2013, buyers have the right to cancel within 14 days of receiving goods. Sellers are responsible for accepting returns and issuing refunds. BigDiscounts is not responsible for enforcing returns between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">6. Prohibited Content</h2>
              <p>Illegal products, counterfeit or stolen goods, adult content, weapons, and misleading listings are strictly prohibited.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">7. Subscription Payments</h2>
              <p>Subscription fees of £1/month are non-refundable. Cancelling deactivates the listing immediately. Payments are handled by Stripe.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">8. Limitation of Liability</h2>
              <p>BigDiscounts is a platform only. We are not responsible for the quality, safety, or legality of listed products, PayPal transactions, or disputes between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">9. Governing Law</h2>
              <p>These terms are governed by the laws of England and Wales.</p>
            </section>
            <section>
              <h2 className="text-xl font-black text-white mb-2">10. Contact</h2>
              <p>Email: <a href="mailto:legal@bigdiscounts.uk" style={{color: '#f59e0b'}} className="hover:opacity-80">legal@bigdiscounts.uk</a></p>
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
