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

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') fetchFavourites()
  }, [status])

  async function fetchFavourites() {
    const idsRes = await fetch('/api/favourites')
    const ids = await idsRes.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      setLoading(false)
      return
    }

    const allRes = await fetch('/api/products')
    const all = await allRes.json()
    setProducts(all.filter((p: Product) => ids.includes(p.id)))
    setLoading(false)
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
    <div className="min-h-screen flex items-center justify-center" style={{background: '#f0f4ff'}}>
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">💰 BigDiscounts</Link>
        <Link href="/browse" className="text-blue-200 hover:text-white">← Back to Browse</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">❤️ My Saved Products</h1>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-gray-500 text-lg mb-4">You haven't saved any products yet.</p>
            <Link href="/browse" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => {
              const photos = JSON.parse(product.photos || '[]')
              const photo = photos[0]
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden relative">
                  <button onClick={() => removeFavourite(product.id)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-red-500 hover:bg-red-50">
                    ❤️
                  </button>
                  <Link href={`/product/${product.id}`}>
                    <div className="h-48 flex items-center justify-center overflow-hidden" style={{background: '#f0f4ff'}}>
                      {photo ? (
                        <img src={photo} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      ) : (
                        <span className="text-6xl">📦</span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{product.category || 'General'}</span>
                      <h3 className="font-bold text-gray-900 mt-2 mb-1 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.seller?.companyName}</p>
                      <p className="text-2xl font-black text-blue-700">£{product.price.toFixed(2)}</p>
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
