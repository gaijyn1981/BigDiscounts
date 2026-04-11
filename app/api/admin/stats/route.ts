import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [reviews, totalSellers, totalBuyers, totalProducts, activeProducts, products, reports] = await Promise.all([
    prisma.seller.count(),
    prisma.buyer.count(),
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      include: { seller: { select: { companyName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.review.findMany({ orderBy: { createdAt: 'desc' }, include: { product: { select: { title: true } } } }),
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
