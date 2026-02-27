import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
