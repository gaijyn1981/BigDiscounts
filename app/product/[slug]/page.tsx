import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareButtons from '@/app/components/ShareButtons'
import FavouriteButton from '@/app/components/FavouriteButton'
import ReviewList from "@/app/components/ReviewList";
import ReportButton from '@/app/components/ReportButton'
import ContactSellerButtons from '@/app/components/ContactSellerButtons'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { TrackView } from '@/app/components/RecentlyViewed'
import ProductAnimations from '@/app/components/ProductAnimations'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { id: slug },
    include: { seller: true }
  })
  if (!product) return {}
  const photos = JSON.parse(product.photos || '[]')
  const ogImage = photos[0] || null
  return {
    title: `${product.title} - £${product.price.toFixed(2)} | BigDiscounts`,
    description: `${product.description.slice(0, 150)} - Sold by ${product.seller.companyName} on BigDiscounts.`,
    alternates: { canonical: `https://www.bigdiscounts.uk/product/${slug}` },
    openGraph: {
      title: `${product.title} - £${product.price.toFixed(2)}`,
      description: `${product.description.slice(0, 150)} - Sold by ${product.seller.companyName} on BigDiscounts.`,
      url: `https://www.bigdiscounts.uk/product/${slug}`,
      images: ogImage ? [{ url: ogImage, alt: product.title }] : [],
      type: 'website',
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": photos[0] || undefined,
    "offers": {
      "@type": "Offer",
      "price": product.price.toFixed(2),
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": product.seller.companyName
      }
    }
  }

  return (
    <main className="min-h-screen" style={{background: '#0a0a0a'}}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackView product={{
        id: product.id,
        title: product.title,
        price: product.price,
        photo: photos[0] || null
      }} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-2xl overflow-hidden" style={{background: '#111111', border: '1px solid #222'}}>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6" style={{background: '#1a1a1a'}}>
              <ProductAnimations
                photos={photos}
                title={product.title}
                price={product.price}
                contactButton={null}
              />
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs mb-3 flex-wrap">
                  <Link href="/" className="text-gray-600 hover:text-white transition-colors">🏠</Link>
                  <span className="text-gray-700">›</span>
                  <Link href="/browse" className="text-gray-600 hover:text-white transition-colors">Browse</Link>
                  {product.category && (
                    <>
                      <span className="text-gray-700">›</span>
                      <Link href={`/browse/${encodeURIComponent(product.category)}`}
                        className="text-gray-600 hover:text-white transition-colors">
                        {product.category}
                      </Link>
                    </>
                  )}
                  <span className="text-gray-700">›</span>
                  <span className="text-gray-400 truncate max-w-xs">{product.title}</span>
                </div>
                {product.category && (
                  <Link href={`/browse/${encodeURIComponent(product.category)}`}>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{background: '#1a1400', color: '#fcd968', border: '1px solid #fcd968'}}>
                      {product.category}
                    </span>
                  </Link>
                )}
                <h1 className="text-3xl font-black text-white mt-3 mb-2">{product.title}</h1>
                {/* Price rendered by ProductAnimations */}
                {product.deliveryTime && (
                  <p className="text-sm font-semibold mb-4" style={{color: '#4ade80'}}>🚚 Delivery: {product.deliveryTime}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">👁️ {product.views} views</p>
                <p className="text-gray-400 leading-relaxed mb-4">{product.description}</p>
              </div>

              <div style={{borderTop: '1px solid #222'}} className="pt-6">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Sold by</p>
                <div className="rounded-xl p-4" style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/seller/${product.seller.id}`} className="font-bold text-white text-lg hover:text-yellow-400 transition-colors">{product.seller.companyName}</Link>
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
                    productId={product.id}
                    productTitle={product.title}
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
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <ReviewList productId={product.id} sellerId={product.seller.id} />
      </div>
    </main>
  )
}
