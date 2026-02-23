import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">About <span style={{color: '#f59e0b'}}>BigDiscounts</span></h1>
          <p className="text-gray-400 text-xl">The UK's premium discount marketplace</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
            <h2 className="text-2xl font-black text-white mb-4">Our Story</h2>
            <p className="text-gray-400 leading-relaxed">BigDiscounts was built with one simple idea — UK sellers deserve a fair, affordable place to list their products without paying huge commissions or monthly fees. For just £1 per listing per month, sellers can reach thousands of buyers across the UK.</p>
          </div>

          <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #f59e0b'}}>
            <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">To connect UK buyers and sellers directly, without the middleman. No hidden fees, no commissions, no nonsense. Just great deals at fair prices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 text-center" style={{background: '#111111', border: '1px solid #222'}}>
              <div className="text-4xl mb-3">🇬🇧</div>
              <h3 className="text-lg font-black text-white mb-2">UK Only</h3>
              <p className="text-gray-500 text-sm">All sellers and buyers are based in the United Kingdom.</p>
            </div>
            <div className="rounded-2xl p-6 text-center" style={{background: '#111111', border: '1px solid #f59e0b'}}>
              <div className="text-4xl mb-3">💷</div>
              <h3 className="text-lg font-black text-white mb-2">Just £1/month</h3>
              <p className="text-gray-500 text-sm">The most affordable marketplace in the UK. No commissions.</p>
            </div>
            <div className="rounded-2xl p-6 text-center" style={{background: '#111111', border: '1px solid #222'}}>
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg font-black text-white mb-2">Direct Deals</h3>
              <p className="text-gray-500 text-sm">Buyers contact sellers directly. Simple, fast, and honest.</p>
            </div>
          </div>

          <div className="rounded-2xl p-8" style={{background: '#111111', border: '1px solid #222'}}>
            <h2 className="text-2xl font-black text-white mb-4">Who We Are</h2>
            <p className="text-gray-400 leading-relaxed mb-6">BigDiscounts is run by Petrica Marin, a sole trader based in Gloucester, UK. We're passionate about supporting UK small businesses and helping buyers find great deals.</p>
            <div className="flex gap-4 flex-wrap">
              <a href="mailto:petricamarin1981@icloud.com"
                className="px-6 py-3 rounded-xl font-bold text-black transition-opacity hover:opacity-90"
                style={{background: '#f59e0b'}}>
                ✉️ Get in Touch
              </a>
              <Link href="/browse"
                className="px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-80"
                style={{background: '#1a1a1a', border: '1px solid #333'}}>
                Browse Deals
              </Link>
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
