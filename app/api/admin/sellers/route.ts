import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const sellers = await prisma.seller.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      companyName: true,
      contactName: true,
      phone: true,
      verified: true,
      createdAt: true,
      _count: { select: { products: true } }
    }
  })
  return NextResponse.json(sellers)
}
