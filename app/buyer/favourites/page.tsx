'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  category: string
  photos: string
  seller: { companyName: string }
}

export default function FavouritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchFavourites()
  }, [status])

  async function fetchFavourites() {
    const idsRes = await fetch('/api/favourites')
    const ids = await idsRes.json()
    if (!Array.isArray(ids) || ids.length === 0) { setLoading(false); return }
    const allRes = await fetch('/api/products')
    const all = await allRes.json()
    setProducts(all.filter((p: Product) => ids.includes(p.id)))
    setLoading(false)
    setTimeout(() => setCardsVisible(true), 100)
  }

  async function removeFavourite(productId: string) {
    await fetch('/api/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    setProducts(products.filter(p => p.id !== productId))
  }

  if (status === 'loading' || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0a'}}>
      <p style={{color: '#fcd968'}} className="text-lg font-bold">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-white mb-8">❤️ My Saved Products</h1>

        {products.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{background: '#111111', border: '1px solid #222'}}>
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-gray-500 text-lg mb-4">You haven't saved any products yet.</p>
            <Link href="/browse"
              className="px-6 py-3 rounded-xl font-bold text-black inline-block"
              style={{background: '#fcd968'}}>
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => {
              const photos = JSON.parse(product.photos || '[]')
              const photo = photos[0]
              return (
                <div key={product.id} className="rounded-2xl overflow-hidden relative"
                  style={{background: '#111111', border: '1px solid #222'}}>
                  <button onClick={() => removeFavourite(product.id)}
                    className="absolute top-3 right-3 z-10 rounded-full w-8 h-8 flex items-center justify-center text-red-400 hover:opacity-80"
                    style={{background: '#1a1a1a', border: '1px solid #333'}}>
                    ❤️
                  </button>
                  <Link href={`/product/${product.id}`}>
                    <div className="h-48 flex items-center justify-center overflow-hidden" style={{background: '#1a1a1a'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1 truncate">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{product.seller?.companyName}</p>
                      <p className="text-2xl font-black" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
