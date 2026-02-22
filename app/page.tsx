import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      {/* Navbar */}
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">💰 BigDiscounts</h1>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="text-blue-200 hover:text-white">Browse</Link>
          <Link href="/login" className="text-blue-200 hover:text-white">Login</Link>
          <Link href="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #60a5fa 100%)'}} className="px-6 py-28 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wide">🇬🇧 UK's #1 Discount Marketplace</span>
          <h2 className="text-6xl font-black text-white mt-6 mb-6 leading-tight">Find Amazing Deals.<br/>Sell For Just £1.</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Connect directly with UK sellers. No middleman. No hidden fees. Just great prices.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/browse" className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 shadow-lg">Browse Deals →</Link>
            <Link href="/register?role=seller" className="bg-white text-blue-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 shadow-lg">Start Selling</Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{background: '#1e3a8a'}} className="py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-12 text-center">
          <div><span className="text-yellow-400 font-black text-2xl">£1</span><p className="text-blue-200 text-sm">Per listing/month</p></div>
          <div><span className="text-yellow-400 font-black text-2xl">0%</span><p className="text-blue-200 text-sm">Commission</p></div>
          <div><span className="text-yellow-400 font-black text-2xl">100%</span><p className="text-blue-200 text-sm">UK-based sellers</p></div>
          <div><span className="text-yellow-400 font-black text-2xl">FREE</span><p className="text-blue-200 text-sm">To browse</p></div>
        </div>
      </div>

      {/* For Sellers */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div style={{background: '#1e3a8a'}} className="h-1 w-8 rounded"></div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">For Sellers</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-blue-600">
            <div className="text-4xl mb-3">🏷️</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">£1 Per Listing</h3>
            <p className="text-gray-500 text-sm">List each product for just £1/month. No commission on sales ever.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-blue-600">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">No Commission</h3>
            <p className="text-gray-500 text-sm">Buyers pay you directly. You keep 100% of every single sale.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-blue-600">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">You Control Shipping</h3>
            <p className="text-gray-500 text-sm">Handle shipping your way. Full control over your business.</p>
          </div>
        </div>
      </div>

      {/* For Buyers */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-8 rounded" style={{background: '#f59e0b'}}></div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">For Buyers</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-yellow-400">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">Free to Browse</h3>
            <p className="text-gray-500 text-sm">No account needed. Browse hundreds of discounted products instantly.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-yellow-400">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">Contact Sellers Directly</h3>
            <p className="text-gray-500 text-sm">Deal directly with sellers. No middleman, no markup, no hassle.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-t-4 border-yellow-400">
            <div className="text-4xl mb-3">🇬🇧</div>
            <h3 className="font-black text-lg mb-2 text-gray-800">UK-Based Sellers</h3>
            <p className="text-gray-500 text-sm">All sellers are UK-based. Fast delivery and local support.</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{background: '#1e3a8a'}} className="py-12 text-center">
        <h3 className="text-3xl font-black text-white mb-4">Ready to start selling?</h3>
        <p className="text-blue-200 mb-6">Join hundreds of UK sellers already on BigDiscounts</p>
        <Link href="/register?role=seller" className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-yellow-300">Get Started for £1 →</Link>
      </div>
      <footer style={{background: "#0f2460"}} className="py-6 text-center text-blue-300 text-sm">
        <Link href="/privacy" className="hover:text-white mx-3">Privacy Policy</Link>
        <span className="text-blue-600">·</span>
        <Link href="/terms" className="hover:text-white mx-3">Terms &amp; Conditions</Link>
        <p className="mt-2 text-blue-400">© 2026 BigDiscounts. Sole trader: Petrica Marin, Gloucester, UK</p>
        <p className="mt-1 text-blue-400">Contact: <a href="mailto:petricamarin1981@icloud.com" className="hover:text-white">petricamarin1981@icloud.com</a></p>
        <div className="mt-3 flex justify-center gap-4 flex-wrap">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms &amp; Conditions</a>
          <a href="/cookies" className="hover:text-white">Cookie Policy</a>
          <a href="/data-request" className="hover:text-white">Data Request</a>
          <a href="/about" className="hover:text-white">About Us</a>
        </div>
      </footer>
    </main>
  )
}
