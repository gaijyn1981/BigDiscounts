import Link from 'next/link'

export default function Terms() {
  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">💰 BigDiscounts</Link>
        <Link href="/" className="text-blue-200 hover:text-white">← Back to Home</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: February 2026</p>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. About BigDiscounts</h2>
              <p>BigDiscounts is a UK online marketplace allowing sellers to list products for £1 per product per month. Buyers browse and contact sellers directly. BigDiscounts does not handle transactions between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Seller Accounts</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sellers must be based in the United Kingdom</li>
                <li>Sellers must provide accurate company and contact information</li>
                <li>Each listing costs £1/month billed via Stripe</li>
                <li>Listings activate only after successful payment</li>
                <li>Sellers are responsible for the accuracy of their listings</li>
                <li>BigDiscounts may remove listings that violate these terms</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Buyer Accounts</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Buyers can browse for free without an account</li>
                <li>Buyers contact sellers directly and arrange payment independently</li>
                <li>BigDiscounts is not responsible for transactions between buyers and sellers</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Prohibited Content</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Illegal products or services</li>
                <li>Counterfeit or stolen goods</li>
                <li>Adult or explicit content</li>
                <li>Weapons or dangerous items</li>
                <li>Misleading or fraudulent listings</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Payments & Refunds</h2>
              <p>Subscription fees of £1/month are non-refundable. Cancelling deactivates the listing at the end of the billing period. Payments handled by Stripe.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">6. Limitation of Liability</h2>
              <p>BigDiscounts is a platform only. We are not responsible for the quality, safety, or legality of listed products, or disputes between buyers and sellers.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">7. Governing Law</h2>
              <p>These terms are governed by the laws of England and Wales.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">8. Contact</h2>
              <p>Email: <a href="mailto:legal@bigdiscounts.uk" className="text-blue-600 hover:underline">legal@bigdiscounts.uk</a></p>
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
