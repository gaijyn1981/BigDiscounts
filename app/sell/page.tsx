import Link from 'next/link'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Online in the UK | £1/Month Marketplace — BigDiscounts',
  description: 'Looking to sell online in the UK without paying high commission? BigDiscounts offers a fair £1/month listing fee with 0% commission and full seller control.',
}

export default async function SellPage() {
  const session = await getServerSession()

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp2 {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: fadeUp 0.7s ease forwards; }
        .hero-animate-delay { animation: fadeUp2 0.7s ease 0.2s forwards; opacity: 0; }
        .pulse-btn:hover { transform: scale(1.05); transition: transform 0.2s ease; }
      `}</style>
      <section className="px-6 py-24 text-center" style={{background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)'}}>
        <div className="max-w-3xl mx-auto hero-animate">
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-bold" style={{background: '#1a1400', border: '1px solid #fcd968', color: '#fcd968'}}>
            UK-Based Marketplace
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Sell Online in the UK with <span style={{color: '#fcd968'}}>Fair, Transparent Fees</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            List products for £1/month and keep 100% of what you sell — no commissions, no hidden fees, no contracts.
          </p>
          <Link href="/register?type=seller" style={{background: '#fcd968'}}
            className="pulse-btn text-black px-10 py-4 rounded-xl font-black text-xl inline-block">
            Start Selling Now — £1/month
          </Link>
          <p className="text-gray-600 text-sm mt-4">No contract. Cancel anytime.</p>
        </div>
      </section>

      <section className="px-6 py-14" style={{background: '#111111'}}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-4">Our Purpose</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            Many marketplaces charge commission on every sale, hold funds, and control your visibility. BigDiscounts was created to offer a fair, transparent alternative for UK sellers — a simple £1/month fee, direct buyer contact, and full control over your pricing, branding, and fulfilment.
          </p>
          <p className="text-gray-500 leading-relaxed mt-4">
            If you are looking for an alternative to Amazon, eBay, or other high-fee marketplaces in the UK, BigDiscounts offers a straightforward solution. Sellers retain full control while reaching buyers across the United Kingdom.
          </p>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-2">Why Choose BigDiscounts Over Other Marketplaces</h2>
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
                  <td className="px-3 py-4 md:px-6 md:py-5 font-black text-base md:text-lg" style={{color: '#fcd968'}}>BigDiscounts</td>
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
          <h2 className="text-3xl font-black text-white mb-4">Keep 100% of Every Sale</h2>
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
              <div key={item.label} className="p-4 rounded-xl text-center" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-gray-300 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-12">How to Start Selling in Minutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {[
              { icon: '👤', step: '1', title: 'Register your seller account', desc: 'Create your profile in under 2 minutes. No approval process needed.' },
              { icon: '📸', step: '2', title: 'Upload your products', desc: 'Add photos, descriptions and prices. Up to 4 photos per listing.' },
              { icon: '✅', step: '3', title: 'Your listings go live', desc: 'Pay £1/month per listing and your product is immediately visible to buyers.' },
              { icon: '💬', step: '4', title: 'Buyers contact you directly', desc: 'Interested buyers message you directly — no forced checkout or platform interference.' },
              { icon: '💰', step: '5', title: 'You arrange payment and delivery', desc: 'Handle payment and shipping your way. You keep 100% of every sale.' },
            ].map(item => (
              <div key={item.step} className="p-6 rounded-2xl" style={{background: '#111111', border: '1px solid #fcd968'}}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-black mb-2" style={{color: '#fcd968'}}>STEP {item.step}</div>
                <h3 className="text-sm font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{background: '#111111'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">Who Can Sell on BigDiscounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🇬🇧', text: 'UK-based marketplace' },
              { icon: '✅', text: 'No hidden fees — ever' },
              { icon: '💬', text: 'Buyers contact you directly' },
              { icon: '🔒', text: 'Secure Stripe payments' },
              { icon: '📣', text: 'Actively promoted across Google & social media' },
              { icon: '❌', text: 'Cancel anytime, no contract' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 p-4 rounded-xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{background: '#0a0a0a'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do you take any commission on sales?',
                a: 'No. BigDiscounts charges a flat £1/month listing fee per product. We take 0% commission on any sale you make.'
              },
              {
                q: 'Do I need to sign a contract?',
                a: 'No contract required. Your listing runs month to month and you can cancel at any time. Your listing stays active until the end of your current billing period.'
              },
              {
                q: 'How do I get paid?',
                a: 'You and the buyer agree on payment directly. You can use PayPal, bank transfer, or any method you prefer. BigDiscounts does not handle or hold payments between buyers and sellers.'
              },
              {
                q: 'Is BigDiscounts only for UK sellers?',
                a: 'Yes — BigDiscounts is a UK-based marketplace open to any UK seller, whether you are an independent trader, small business, dropshipper, or established retailer.'
              },
              {
                q: 'What happens after I list my product?',
                a: 'Your product goes live on the marketplace immediately after payment. Buyers can browse, view your listing, and contact you directly through the platform.'
              },
              {
                q: 'Can I list multiple products?',
                a: 'Yes. Each product is listed separately for £1/month. There is no limit on how many products you can list.'
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl" style={{background: '#111111', border: '1px solid #fcd968'}}>
                <h3 className="font-black text-white mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-500 text-sm">
            Still have questions? Contact us at{' '}
            <a href="mailto:hello@bigdiscounts.uk" style={{color: '#fcd968'}} className="hover:opacity-80">hello@bigdiscounts.uk</a>
          </p>
        </div>
      </section>

      <section className="px-6 py-24 text-center" style={{background: '#111111'}}>
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
          <span className="text-2xl font-black" style={{color: '#fcd968'}}>BigDiscounts</span>
          <p className="text-gray-600 text-sm mt-3">hello@bigdiscounts.uk</p>
          <p className="text-gray-600 text-xs mt-1">BigDiscounts is operated by Petrica Marin, Sole Trader, United Kingdom.</p>
          <div className="flex justify-center gap-6 mt-3">
            <Link href="/terms" className="text-gray-700 text-xs hover:text-gray-500">Terms & Conditions</Link>
            <Link href="/sell" className="text-gray-700 text-xs hover:text-gray-500">Seller Policy</Link>
            <Link href="/browse" className="text-gray-700 text-xs hover:text-gray-500">Browse Deals</Link>
          </div>
          <p className="text-gray-700 text-xs mt-3">© 2026 BigDiscounts. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
