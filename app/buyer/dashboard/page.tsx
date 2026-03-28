'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteAccountButton from '@/app/components/DeleteAccountButton'
import { RecentlyViewedSection } from '@/app/components/RecentlyViewed'

interface Product {
  id: string
  title: string
  price: number
  category: string
  photos: string
  seller: { companyName: string }
}

export default function BuyerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favourites, setFavourites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchFavourites()
  }, [status])

  async function fetchFavourites() {
    try {
      const idsRes = await fetch('/api/favourites')
      if (!idsRes.ok) { setLoading(false); return }
      const ids = await idsRes.json()
      if (!Array.isArray(ids) || ids.length === 0) { setLoading(false); return }
      const allRes = await fetch('/api/products')
      if (!allRes.ok) { setLoading(false); return }
      const all = await allRes.json()
      if (Array.isArray(all)) {
        setFavourites(all.filter((p: Product) => ids.includes(p.id)))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setTimeout(() => setCardsVisible(true), 100)
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#fcd968'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10" style={{
          opacity: cardsVisible ? 1 : 0,
          transform: cardsVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <h1 className="text-3xl font-black text-white mb-1">Welcome back, {session?.user?.name}! 👋</h1>
          <p className="text-gray-500">Browse deals or check your saved products.</p>
        </div>

        {favourites.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Your Saved Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favourites.slice(0, 6).map((product, i) => {
                const photos = JSON.parse(product.photos || '[]')
                const photo = photos[0]
                return (
                  <Link key={product.id} href={`/product/${product.id}`}
                    className="rounded-2xl overflow-hidden group"
                    style={{
                      background: '#111111',
                      border: '1px solid #222',
                      opacity: cardsVisible ? 1 : 0,
                      transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
                      transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
                    }}>
                    <div className="h-40 flex items-center justify-center overflow-hidden" style={{background: '#1a1a1a'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover group-hover:scale-105" style={{transition: 'transform 0.3s ease'}} />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate mb-1">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-1">{product.seller?.companyName}</p>
                      <p className="text-xl font-black" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            {favourites.length > 6 && (
              <div className="text-center mt-6">
                <Link href="/buyer/favourites" style={{color: '#fcd968'}} className="font-bold hover:opacity-80">
                  View all {favourites.length} saved products →
                </Link>
              </div>
            )}
          </div>
        )}

        {favourites.length === 0 && (
          <div className="rounded-2xl p-12 text-center mb-8" style={{background: '#111111', border: '1px solid #222'}}>
            <div className="text-5xl mb-4">🛍️</div>
            <h2 className="text-xl font-black text-white mb-2">No saved products yet</h2>
            <p className="text-gray-500 mb-6">Browse deals and save products you like!</p>
            <Link href="/browse"
              className="px-6 py-3 rounded-xl font-bold text-black inline-block"
              style={{background: '#fcd968'}}>
              Browse Deals
            </Link>
          </div>
        )}

        <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #f87171'}}>
          <h2 className="text-xl font-black text-white mb-2">Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all saved products.</p>
          <DeleteAccountButton type="buyer" />
        </div>
      <RecentlyViewedSection currency='£' />
      </div>
    </main>
  )
}
