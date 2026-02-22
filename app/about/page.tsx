import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-blue-200 hover:text-white">← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'}} className="px-6 py-16 text-center">
        <h1 className="text-4xl font-black text-white mb-4">About BigDiscounts</h1>
        <p className="text-blue-100 text-xl max-w-2xl mx-auto">A simple, honest marketplace built for UK buyers and sellers.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">BigDiscounts was created with a simple idea — UK sellers deserve a marketplace that doesn't take a huge cut of every sale. Most platforms charge 10-15% commission on every transaction. We think that's too much.</p>
          <p className="text-gray-600 leading-relaxed">So we built BigDiscounts. Sellers pay just £1 per listing per month. That's it. No commission, no hidden fees. Buyers contact sellers directly and keep 100% of their money in the deal.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">To make buying and selling online fairer for everyone in the UK. We believe in transparency, simplicity, and supporting small UK businesses and sole traders.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🇬🇧</div>
            <h3 className="font-black text-gray-900 mb-1">UK Only</h3>
            <p className="text-gray-500 text-sm">All sellers are UK-based</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-black text-gray-900 mb-1">Just £1/month</h3>
            <p className="text-gray-500 text-sm">No commission ever</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-black text-gray-900 mb-1">Direct Deals</h3>
            <p className="text-gray-500 text-sm">Buyer meets seller directly</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">BigDiscounts is operated by Petrica Marin, a sole trader based in Gloucester, UK.</p>
          <p className="text-gray-600 leading-relaxed">We are committed to providing a safe, fair, and transparent marketplace for all UK buyers and sellers.</p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <a href="mailto:petricamarin1981@icloud.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
              ✉️ Contact Us
            </a>
            <Link href="/browse"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300">
              Browse Deals →
            </Link>
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
