import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareButtons from '@/app/components/ShareButtons'
import FavouriteButton from '@/app/components/FavouriteButton'

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

  return (
    <main className="min-h-screen" style={{background: '#f0f4ff'}}>
      <nav style={{background: '#1e3a8a'}} className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">🇬🇧 BigDiscounts</Link>
        <Link href="/browse" className="text-blue-200 hover:text-white">← Back to Browse</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6" style={{background: '#f0f4ff'}}>
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
                  style={{background: '#e0e8ff'}}>
                  📦
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                {product.category && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
                <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2">{product.title}</h1>
                <p className="text-4xl font-black mb-4" style={{color: '#1e3a8a'}}>£{product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400 mb-4">👁️ {product.views} views</p>
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-3">Sold by</p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-bold text-gray-900 text-lg">{product.seller.companyName}</p>
                  <p className="text-gray-500 text-sm mb-3">{product.seller.contactName}</p>
                  {product.seller.paypalMe && (
                    <a href={`https://paypal.me/${product.seller.paypalMe}/${product.price}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 mb-2">
                      💳 Buy Now via PayPal
                    </a>
                  )}
                  <a href={`mailto:${product.seller.email}`}
                    className="block w-full text-center text-white py-3 rounded-xl font-bold text-lg hover:opacity-90"
                    style={{background: '#1e3a8a'}}>
                    ✉️ Contact Seller
                  </a>
                  <a href={`tel:${product.seller.phone}`}
                    className="block w-full text-center bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 mt-2">
                    📞 Call Seller
                  </a>
                  <FavouriteButton productId={product.id} />
                  <ShareButtons title={product.title} id={product.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
