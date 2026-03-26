import Link from 'next/link'
import AnimatedHome from './components/AnimatedHome'
import Navbar from './components/Navbar'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'UK Marketplace for Sellers & Buyers | BigDiscounts — Fair, Low Fee Marketplace',
  description: 'BigDiscounts is a UK marketplace built to support sellers and buyers. List products for £1/month with 0% commission, or browse deals and buy direct from UK sellers.',
}

export default async function Home() {
  const session = await getServerSession()

  const recentProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { seller: { select: { companyName: true } } }
  })

  const totalProducts = await prisma.product.count({ where: { active: true } })
  const totalSellers = await prisma.seller.count()

  const showCounters = totalSellers >= 50

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How much does it cost to list on BigDiscounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "It costs just £1/month to list your products on BigDiscounts. There are no commission fees, no hidden costs, and no contracts. You can cancel anytime."
              }
            },
            {
              "@type": "Question",
              "name": "Does BigDiscounts take commission on sales?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. BigDiscounts charges 0% commission on all sales. You keep 100% of your revenue. The only cost is the £1/month listing fee."
              }
            },
            {
              "@type": "Question",
              "name": "How do buyers contact sellers on BigDiscounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Buyers contact sellers directly through the platform. There is no middleman — you communicate and transact directly with the buyer."
              }
            },
            {
              "@type": "Question",
              "name": "Who can sell on BigDiscounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Any UK-based business or independent seller can list products on BigDiscounts. It is designed to support small businesses and independent sellers."
              }
            },
            {
              "@type": "Question",
              "name": "How do I start selling on BigDiscounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simply register an account, create your product listings, and activate your subscription for £1/month. Your listings will be live immediately."
              }
            }
          ]
        }) }}
      />
      <Navbar session={!!session?.user} userName={session?.user?.name?.split(' ')[0]} />

      <AnimatedHome
        session={!!session?.user}
        recentProducts={recentProducts}
        totalProducts={totalProducts}
        totalSellers={totalSellers}
        showCounters={showCounters}
      />

      <section className="px-6 py-16" style={{background: '#111111'}}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">How Buying and Selling Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="p-8 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <p className="text-sm font-bold mb-6 inline-block px-3 py-1 rounded-full" style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>For Sellers</p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-black text-white mb-1">1. List your products</p>
                    <p className="text-gray-400 text-sm">Create your listing in minutes with photos, description and price.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-black text-white mb-1">2. Pay just £1/month</p>
                    <p className="text-gray-400 text-sm">Activate your listing with our simple £1/month subscription.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-black text-white mb-1">3. Keep 100% of every sale</p>
                    <p className="text-gray-400 text-sm">Buyers contact you directly. No commission, no middleman.</p>
                  </div>
                </div>
              </div>
              <Link href="/sell" className="inline-block mt-8 px-6 py-3 rounded-xl font-black text-black hover:opacity-90 transition-opacity" style={{background: '#fcd968'}}>
                Start Selling — £1/mo →
              </Link>
            </div>

            <div className="p-8 rounded-2xl" style={{background: '#1a1a1a', border: '1px solid #fcd968'}}>
              <p className="text-sm font-bold mb-6 inline-block px-3 py-1 rounded-full" style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>For Buyers</p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-black text-white mb-1">1. Browse UK deals</p>
                    <p className="text-gray-400 text-sm">Discover products from UK sellers and businesses across all categories.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-black text-white mb-1">2. Contact sellers directly</p>
                    <p className="text-gray-400 text-sm">No middleman. Contact the seller directly and pay securely via PayPal.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-black text-white mb-1">3. No buyer fees, ever</p>
                    <p className="text-gray-400 text-sm">Free to browse and buy. No hidden charges, no platform fees.</p>
                  </div>
                </div>
              </div>
              <Link href="/browse" className="inline-block mt-8 px-6 py-3 rounded-xl font-black text-black hover:opacity-90 transition-opacity" style={{background: '#fcd968'}}>
                Browse Deals →
              </Link>
            </div>

          </div>
        </div>
      </section>


      <section className="px-6 py-24 text-center" style={{background: '#111111'}}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            A Smarter Way to Buy and Sell in the UK.
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            BigDiscounts is a transparent marketplace where buyers and businesses connect directly — without unnecessary mark-ups or hidden barriers.
          </p>
          <div className="space-y-3 mb-12">
            <p className="text-white font-bold text-lg">Designed for fairness.</p>
            <p className="text-white font-bold text-lg">Built for visibility.</p>
            <p className="text-white font-bold text-lg">Grounded in trust.</p>
          </div>
          <p className="text-gray-500 text-base italic">
            A marketplace that puts people before platforms — always.
          </p>
        </div>
      </section>

      <footer style={{background: '#111111', borderTop: '1px solid #1a1a1a'}} className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8 mb-8">
            <div>
              <p className="text-2xl font-black mb-2" style={{color: '#fcd968'}}>BigDiscounts</p>
              <p className="text-gray-500 text-sm max-w-xs">Buy direct or sell for just £1/month. No commissions. No hidden fees.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-white font-bold mb-3">Site</p>
                <div className="space-y-2">
                  <Link href="/browse" className="block text-gray-500 hover:text-white text-sm">Browse</Link>
                  <Link href="/sell" className="block text-gray-500 hover:text-white text-sm">Start Selling</Link>
                  <Link href="/about" className="block text-gray-500 hover:text-white text-sm">About Us</Link>
                  <Link href="/contact" className="block text-gray-500 hover:text-white text-sm">Contact Us</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-bold mb-3">Categories</p>
                <div className="space-y-2">
                  <Link href="/browse/Electronics%20%26%20Tech" className="block text-gray-500 hover:text-white text-sm">Electronics & Tech</Link>
                  <Link href="/browse/Clothing%20%26%20Fashion" className="block text-gray-500 hover:text-white text-sm">Clothing & Fashion</Link>
                  <Link href="/browse/Home%20%26%20Living" className="block text-gray-500 hover:text-white text-sm">Home & Living</Link>
                  <Link href="/browse/Health%20%26%20Beauty" className="block text-gray-500 hover:text-white text-sm">Health & Beauty</Link>
                  <Link href="/browse/Garden%20%26%20Outdoor" className="block text-gray-500 hover:text-white text-sm">Garden & Outdoor</Link>
                  <Link href="/browse/Sports%20%26%20Fitness" className="block text-gray-500 hover:text-white text-sm">Sports & Fitness</Link>
                  <Link href="/browse/Toys%20%26%20Games" className="block text-gray-500 hover:text-white text-sm">Toys & Games</Link>
                  <Link href="/browse/Pets" className="block text-gray-500 hover:text-white text-sm">Pets</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-bold mb-3">Legal</p>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-gray-500 hover:text-white text-sm">Privacy Policy</Link>
                  <Link href="/terms" className="block text-gray-500 hover:text-white text-sm">Terms & Conditions</Link>
                  <Link href="/cookies" className="block text-gray-500 hover:text-white text-sm">Cookie Policy</Link>
                  <Link href="/data-request" className="block text-gray-500 hover:text-white text-sm">Data Request</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{borderTop: '1px solid #1a1a1a'}} className="pt-6 text-center">
            <p className="text-gray-600 text-sm">hello@bigdiscounts.uk</p>
            <p className="text-gray-600 text-xs mt-1">BigDiscounts is operated by Petrica Marin, Sole Trader, United Kingdom.</p>
            <p className="text-gray-700 text-xs mt-1">© 2026 BigDiscounts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
