import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareButtons from '@/app/components/ShareButtons'
import FavouriteButton from '@/app/components/FavouriteButton'
import ReportButton from '@/app/components/ReportButton'
import ContactSellerButtons from '@/app/components/ContactSellerButtons'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { id: slug },
    include: { seller: true }
  })
  if (!product) return {}
  return {
    title: `${product.title} - £${product.price.toFixed(2)} | BigDiscounts`,
    description: `${product.description.slice(0, 150)} - Sold by ${product.seller.companyName} on BigDiscounts.`,
    openGraph: {
      title: `${product.title} - £${product.price.toFixed(2)}`,
      description: `${product.description.slice(0, 150)}`,
      url: `https://www.bigdiscounts.uk/product/${slug}`,
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { id: slug },
    include: { seller: true }
  })

  if (!product) notFound()

  await prisma.product.update({
    where: { id: slug },
    data: { views: { increment: 1 } }
  })

  const photos = JSON.parse(product.photos || '[]')
  const session = await getServerSession()

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <nav style={{background: '#111111', borderBottom: '1px solid #2a2a2a'}} className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black" style={{color: '#fcd968'}}>🇬🇧 BigDiscounts</Link>
        <div className="flex items-center gap-4">
          <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">← Browse</Link>
          {session?.user ? (
            <Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link href="/register" style={{background: '#fcd968'}} className="text-black px-5 py-2 rounded-lg font-bold hover:opacity-90">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-2xl overflow-hidden" style={{background: '#111111', border: '1px solid #222'}}>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6" style={{background: '#1a1a1a'}}>
              {photos.length > 0 ? (
                <div className="space-y-3">
                  <img src={photos[0]} alt={product.title}
                    className="w-full h-72 object-cover rounded-xl" />
                  {photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photos.slice(1).map((photo: string, i: number) => (
                        <img key={i} src={photo} alt={product.title}
                          className="w-full h-24 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-72 rounded-xl flex items-center justify-center text-8xl"
                  style={{background: '#222'}}>
                  📦
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                {product.category && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>
                    {product.category}
                  </span>
                )}
                <h1 className="text-3xl font-black text-white mt-3 mb-2">{product.title}</h1>
                <p className="text-4xl font-black mb-4" style={{color: '#fcd968'}}>£{product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-4">👁️ {product.views} views</p>
                <p className="text-gray-400 leading-relaxed mb-4">{product.description}</p>
              </div>

              <div style={{borderTop: '1px solid #222'}} className="pt-6">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Sold by</p>
                <div className="rounded-xl p-4" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white text-lg">{product.seller.companyName}</p>
                    {product.seller.verified && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{background: '#0a1a0a', color: '#4ade80', border: '1px solid #4ade80'}}>
                        ✅ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{product.seller.contactName}</p>
                  <ContactSellerButtons
                    email={product.seller.email}
                    phone={product.seller.phone}
                    paypalMe={product.seller.paypalMe}
                    price={product.price}
                  />
                  <FavouriteButton productId={product.id} />
                  <ShareButtons title={product.title} id={product.id} />
                  <ReportButton productId={product.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
