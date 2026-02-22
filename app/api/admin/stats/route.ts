import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const [totalSellers, totalBuyers, totalProducts, activeProducts, products, reports] = await Promise.all([
    prisma.seller.count(),
    prisma.buyer.count(),
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      include: { seller: { select: { companyName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  ])

  return NextResponse.json({
    stats: { totalSellers, totalBuyers, totalProducts, activeProducts },
    products,
    reports
  })
}
