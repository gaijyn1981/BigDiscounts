import Link from 'next/link'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Online for £1/Month | BigDiscounts.uk',
  description: 'List your products on BigDiscounts.uk for just £1/month with 0% commission. Keep 100% of your profits. The UK marketplace alternative to eBay and Amazon.',
}

export default async function SellPage() {
  const session = await getServerSession()

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse</Link>
          <Link href="/sell" className="text-white font-bold transition-colors">Sell</Link>
          {session?.user ? (
            <>
              <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Hi, {session.user.name?.split(' ')[0]}
              </Link>
              <Link href="/seller/dashboard"
                className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm"
                style={{background: '#fcd968', color: 'black'}}>
                Dashboard
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
          )}
        </div>
      </nav>

      <section className="px-6 py-24 text-center" style={{background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)'}}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-bold" style={{background: '#1a1400', border: '1px solid #fcd968', color: '#fcd968'}}>
            🇬🇧 UK-Based Marketplace
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Sell Online for <span style={{color: '#fcd968'}}>£1/Month.</span><br/>
            Keep 100% of Every Sale.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            No commission. No hidden fees. Buyers contact you directly. The UK marketplace built for sellers, not shareholders.
          </p>
          <Link href="/register?type=seller" style={{background: '#fcd968'}}
            className="text-black px-10 py-4 rounded-xl font-black text-xl hover:opacity-90 transition-opacity inline-block">
            Start Selling Now — £1/month
          </Link>
          <p className="text-gray-600 text-sm mt-4">No contract. Cancel anytime.</p>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-2">Why sellers choose BigDiscounts</h2>
          <p className="text-gray-500 text-center mb-10">Stop giving away your profits. Compare the real cost of selling online.</p>
          <div className="rounded-2xl overflow-hidden w-full" style={{border: '1px solid #2a2a2a'}}>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{background: '#1a1a1a', borderBottom: '1px solid #2a2a2a'}}>
                  <th className="text-left px-6 py-4 text-gray-400 font-bold">Platform</th>
                  <th className="text-center px-6 py-4 text-gray-400 font-bold">Monthly Fee</th>
                  <th className="text-center px-6 py-4 text-gray-400 font-bold">Commission</th>
                  <th className="text-center px-6 py-4 text-gray-400 font-bold">You Keep</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #1a1a1a'}}>
                  <td className="px-6 py-4 text-gray-300 font-medium">Amazon</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">£25–39/mo</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-red-400 font-bold">15–20%</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">~80%</td>
                </tr>
                <tr style={{borderBottom: '1px solid #1a1a1a'}}>
                  <td className="px-6 py-4 text-gray-300 font-medium">eBay</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">£0</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-red-400 font-bold">10–15%</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">~85%</td>
                </tr>
                <tr style={{borderBottom: '1px solid #1a1a1a'}}>
                  <td className="px-6 py-4 text-gray-300 font-medium">Etsy</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">£0</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-red-400 font-bold">6.5% + fees</td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-400">~90%</td>
                </tr>
                <tr style={{background: '#1a1400'}}>
                  <td className="px-3 py-4 md:px-6 md:py-5 font-black text-base md:text-lg" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</td>
                  <td className="px-3 py-4 md:px-6 md:py-5 text-center font-black text-lg" style={{color: '#fcd968'}}>£1/month</td>
                  <td className="px-3 py-4 md:px-6 md:py-5 text-center font-black text-lg text-green-400">0%</td>
                  <td className="px-3 py-4 md:px-6 md:py-5 text-center font-black text-lg text-green-400">100%</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-3">Based on typical marketplace fees. BigDiscounts charges no selling commission.</p>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#111111'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-12">Start selling in 3 simple steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-black text-white mb-2">1. Create your account</h3>
              <p className="text-gray-400">Register as a seller in under 2 minutes. No approval needed.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-black text-white mb-2">2. List your products</h3>
              <p className="text-gray-400">Add photos, description and price. Your listing goes live instantly.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-black text-white mb-2">3. Get paid in full</h3>
              <p className="text-gray-400">Buyers contact you directly. You handle payment your way. We take nothing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Built for UK independent sellers</h2>
          <p className="text-gray-500 mb-10">Whether you sell one product or a thousand, BigDiscounts works for you.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🛍️', label: 'Independent retailers' },
              { icon: '🏭', label: 'Small businesses' },
              { icon: '🚚', label: 'Dropshippers' },
              { icon: '🎨', label: 'Makers & crafters' },
              { icon: '📦', label: 'Wholesale suppliers' },
              { icon: '🔄', label: 'eBay & Amazon migrants' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center" style={{background: '#111111', border: '1px solid #2a2a2a'}}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-gray-300 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{background: '#111111'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">Why sellers trust us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🇬🇧', text: 'UK-based marketplace' },
              { icon: '✅', text: 'No hidden fees — ever' },
              { icon: '💬', text: 'Buyers contact you directly' },
              { icon: '🔒', text: 'Secure Stripe payments' },
              { icon: '📣', text: 'Actively promoted across Google & social media' },
              { icon: '❌', text: 'Cancel anytime, no contract' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 p-4 rounded-xl" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center" style={{background: '#0a0a0a'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join UK sellers keeping 100% of every sale on BigDiscounts.</p>
          <Link href="/register?type=seller" style={{background: '#fcd968'}}
            className="text-black px-10 py-4 rounded-xl font-black text-xl hover:opacity-90 transition-opacity inline-block">
            Create your seller account — £1/month
          </Link>
          <p className="text-gray-600 text-sm mt-4">Already have an account? <Link href="/login" style={{color: '#fcd968'}} className="hover:opacity-80">Log in here</Link></p>
        </div>
      </section>

      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
          <p className="text-gray-600 text-sm mt-3">hello@bigdiscounts.uk</p>
          <p className="text-gray-600 text-xs mt-1">BigDiscounts is operated by Petrica Marin, Sole Trader, United Kingdom.</p>
          <p className="text-gray-700 text-xs mt-1">© 2026 BigDiscounts. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
