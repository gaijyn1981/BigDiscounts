import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } }
        ]
      })
    },
    include: {
      seller: { select: { companyName: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(products)
}
