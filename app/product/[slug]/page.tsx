import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.slug },
    include: { seller: true }
  })

  if (!product) notFound()

  const photos = JSON.parse(product.photos || '[]')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">BigDiscounts</Link>
        <Link href="/browse" className="text-gray-600 hover:text-blue-600">← Back to Browse</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 p-2">
              {photos.map((photo: string, index: number) => (
                <img key={index} src={photo} alt={`${product.title} photo ${index + 1}`}
                  className="w-full h-56 object-cover rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">📦</div>
          )}

          <div className="p-8">
            <p className="text-sm text-blue-600 font-medium mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
            <p className="text-4xl font-bold text-blue-600 mb-6">£{product.price.toFixed(2)}</p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sold by</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-1">{product.seller.companyName}</h3>
                <p className="text-gray-600 mb-4">Contact: {product.seller.contactName}</p>
                {product.seller.phone && (
                  <a href={`tel:${product.seller.phone}`}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-3">
                    📞 Call Seller
                  </a>
                )}
                <a href={`mailto:${product.seller.email}`}
                  className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
                  ✉️ Email Seller
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
