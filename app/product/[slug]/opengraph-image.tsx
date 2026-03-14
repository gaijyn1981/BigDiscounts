import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'

export const alt = 'Product on BigDiscounts'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.slug },
    include: { seller: true }
  })

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 80, fontWeight: 900, color: '#fcd968' }}>BigDiscounts</span>
        </div>
      ),
      { ...size }
    )
  }

  const photos = JSON.parse(product.photos || '[]')
  const photo = photos[0] || null

  return new ImageResponse(
    (
      <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
        {photo && (
          <div style={{ width: '50%', height: '100%', display: 'flex' }}>
            <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1, padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#111111' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#fcd968' }}>🇬🇧 BigDiscounts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {product.title.length > 60 ? product.title.slice(0, 57) + '...' : product.title}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#fcd968' }}>
              £{product.price.toFixed(2)}
            </div>
            <div style={{ fontSize: 20, color: '#9ca3af' }}>
              {product.seller.companyName}
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#4b5563' }}>www.bigdiscounts.uk</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
