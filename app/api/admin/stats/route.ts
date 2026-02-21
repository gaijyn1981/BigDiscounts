import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const [totalSellers, totalBuyers, totalProducts, activeProducts, products] = await Promise.all([
    prisma.seller.count(),
    prisma.buyer.count(),
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      include: { seller: { select: { companyName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return NextResponse.json({
    stats: { totalSellers, totalBuyers, totalProducts, activeProducts },
    products
  })
}
