'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteAccountButton from '@/app/components/DeleteAccountButton'

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
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#f59e0b'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/buyer/dashboard" className="text-2xl font-black" style={{color: '#f59e0b'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex items-center gap-4">
          <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse</Link>
          <Link href="/buyer/favourites" className="text-gray-400 hover:text-white transition-colors">❤️ Saved</Link>
          <span className="text-gray-600 text-sm hidden md:block">Hi, {session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{background: '#1a1a1a', color: '#f87171', border: '1px solid #f87171'}}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-1">Welcome back, {session?.user?.name}! 👋</h1>
          <p className="text-gray-500">Browse deals or check your saved products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/browse"
            className="rounded-2xl p-8 flex items-center gap-6 hover:opacity-90 transition-opacity"
            style={{background: '#111111', border: '2px solid #f59e0b'}}>
            <span className="text-5xl">🔍</span>
            <div>
              <h2 className="text-xl font-black text-white mb-1">Browse Deals</h2>
              <p className="text-gray-400 text-sm">Discover the latest products from UK sellers.</p>
            </div>
          </Link>
          <Link href="/buyer/favourites"
            className="rounded-2xl p-8 flex items-center gap-6 hover:opacity-90 transition-opacity"
            style={{background: '#111111', border: '1px solid #333'}}>
            <span className="text-5xl">❤️</span>
            <div>
              <h2 className="text-xl font-black text-white mb-1">Saved Products</h2>
              <p className="text-gray-400 text-sm">{favourites.length} product{favourites.length !== 1 ? 's' : ''} saved.</p>
            </div>
          </Link>
        </div>

        {favourites.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Your Saved Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favourites.slice(0, 6).map(product => {
                const photos = JSON.parse(product.photos || '[]')
                const photo = photos[0]
                return (
                  <Link key={product.id} href={`/product/${product.id}`}
                    className="rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
                    style={{background: '#111111', border: '1px solid #222'}}>
                    <div className="h-40 flex items-center justify-center overflow-hidden" style={{background: '#1a1a1a'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate mb-1">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-1">{product.seller?.companyName}</p>
                      <p className="text-xl font-black" style={{color: '#f59e0b'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            {favourites.length > 6 && (
              <div className="text-center mt-6">
                <Link href="/buyer/favourites" style={{color: '#f59e0b'}} className="font-bold hover:opacity-80">
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
              style={{background: '#f59e0b'}}>
              Browse Deals
            </Link>
          </div>
        )}

        <div className="rounded-2xl p-6" style={{background: '#111111', border: '1px solid #f87171'}}>
          <h2 className="text-xl font-black text-white mb-2">Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all saved products.</p>
          <DeleteAccountButton type="buyer" />
        </div>
      </div>
    </main>
  )
}
